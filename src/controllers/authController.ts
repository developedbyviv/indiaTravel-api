import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { sendOtpEmail } from '../utils/mailer';
import { AuthRequest } from '../middleware/auth';

// ── Token helpers ─────────────────────────────────────────────────

const generateAccessToken = (userId: string): string =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as unknown as number,
  });

const generateRefreshToken = (userId: string): string =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string || process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as unknown as number,
  });

const generateOtp = (): string =>
  crypto.randomInt(100000, 999999).toString();

// ── POST /auth/register (alias: /auth/signup) ────────────────────
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(409).json({ success: false, message: 'Email already registered' });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, phone, password: hashed });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
};

// ── POST /auth/login ─────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    if (!user.password || user.authProvider === 'google') {
      res.status(401).json({ success: false, message: 'Please login with Google' });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// ── POST /auth/logout ────────────────────────────────────────────
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, { $unset: { refreshToken: '' } });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch {
    res.status(500).json({ success: false, message: 'Logout failed' });
  }
};

// ── POST /auth/refresh ───────────────────────────────────────────
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      res.status(400).json({ success: false, message: 'Refresh token required' });
      return;
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET as string;
    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, refreshSecret) as { id: string };
    } catch {
      res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
      return;
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      res.status(401).json({ success: false, message: 'Refresh token revoked or not found' });
      return;
    }

    const accessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ success: true, accessToken, refreshToken: newRefreshToken });
  } catch {
    res.status(500).json({ success: false, message: 'Token refresh failed' });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── POST /auth/google ────────────────────────────────────────────
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ success: false, message: 'ID token is required' });
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      res.status(400).json({ success: false, message: 'Invalid Google token' });
      return;
    }

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || 'Google User',
        email,
        avatar: picture,
        authProvider: 'google',
      });
    }

    const accessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
};

// ── GET /auth/me ─────────────────────────────────────────────────
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password -otp -refreshToken');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, user });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to get user' });
  }
};

// ── POST /auth/password/forgot ───────────────────────────────────
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return 200 to avoid email enumeration
    if (!user) {
      res.json({ success: true, message: 'If that email exists, an OTP has been sent' });
      return;
    }

    const otp = generateOtp();
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
    user.otp = { code: otp, expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000) };
    await user.save();

    await sendOtpEmail(email, otp);
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// ── POST /auth/verify-otp ────────────────────────────────────────
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.otp?.code || !user.otp?.expiresAt) {
      res.status(400).json({ success: false, message: 'OTP not found or expired' });
      return;
    }

    if (user.otp.code !== otp) {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
      return;
    }

    if (new Date() > user.otp.expiresAt) {
      res.status(400).json({ success: false, message: 'OTP has expired' });
      return;
    }

    res.json({ success: true, message: 'OTP verified' });
  } catch {
    res.status(500).json({ success: false, message: 'OTP verification failed' });
  }
};

// ── POST /auth/password/reset ────────────────────────────────────
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.otp?.code || !user.otp?.expiresAt) {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      return;
    }

    if (user.otp.code !== otp || new Date() > user.otp.expiresAt) {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.otp = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch {
    res.status(500).json({ success: false, message: 'Password reset failed' });
  }
};
