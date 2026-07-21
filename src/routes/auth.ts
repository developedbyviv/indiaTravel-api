import { Router } from 'express';
import {
  signup,
  login,
  logout,
  refreshToken,
  googleAuth,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from '../schemas/authSchema';

const router = Router();

// ── Registration & Login ──────────────────────────────────────────
router.post('/register', validate(signupSchema), signup);      // spec: POST /auth/register
router.post('/signup', validate(signupSchema), signup);        // legacy alias
router.post('/login', validate(loginSchema), login);

// ── Session management ────────────────────────────────────────────
router.post('/logout', protect, logout);
router.post('/refresh', refreshToken);

// ── Google OAuth ──────────────────────────────────────────────────
router.post('/google', googleAuth);

// ── Current user ──────────────────────────────────────────────────
router.get('/me', protect, getMe);

// ── Password reset ────────────────────────────────────────────────
router.post('/password/forgot', validate(forgotPasswordSchema), forgotPassword);   // spec path
router.post('/password/reset', validate(resetPasswordSchema), resetPassword);      // spec path
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);   // legacy alias
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);      // legacy alias

export default router;
