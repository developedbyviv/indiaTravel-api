import { Router } from 'express';
import {
  signup,
  login,
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

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
