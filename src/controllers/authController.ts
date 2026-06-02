import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { sendOtpEmail } from '../utils/mailer';
import { AuthRequest } from '../middleware/auth';

const generateToken = (userId: string): string =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const generateOtp = (): string =>
  crypto.randomInt(100000, 999999).toString();

// POST /api/auth/signup
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
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: { name: user.name, email: user.email, phone: user.phone, avatar: user.avatar },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
};

// POST /api/auth/login
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

    const token = generateToken(user._id.toString());
    res.json({
      success: true,
      token,
      user: { name: user.name, email: user.email, phone: user.phone, avatar: user.avatar },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
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
        authProvider: 'google'
      });
    }

    const token = generateToken(user._id.toString());
    res.json({
      success: true,
      token,
      user: { name: user.name, email: user.email, phone: user.phone, avatar: user.avatar },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password -otp');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, user });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to get user' });
  }
};

// POST /api/auth/forgot-password
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

// POST /api/auth/verify-otp
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

// POST /api/auth/reset-password
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
