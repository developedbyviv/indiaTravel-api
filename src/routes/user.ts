import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getCart,
  addToCart,
  removeFromCart,
  replaceCart,
  checkoutCart,
  getFavourites,
  addFavourite,
  removeFavourite,
  getUserEnquiries,
} from '../controllers/userController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { changePasswordSchema } from '../schemas/authSchema';

const router = Router();

// All user routes require auth
router.use(protect);

// ── Profile ───────────────────────────────────────────────────────
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.patch('/profile', updateProfile);          // spec: PATCH /account/profile
router.put('/change-password', validate(changePasswordSchema), changePassword);
router.delete('/account', deleteAccount);

// ── Cart ──────────────────────────────────────────────────────────
router.get('/cart', getCart);
router.post('/cart', addToCart);
router.put('/cart', replaceCart);                 // spec: PUT /account/cart
router.post('/cart/checkout', checkoutCart);      // spec: POST /account/cart/checkout
router.delete('/cart/:id', removeFromCart);

// ── Favourites ────────────────────────────────────────────────────
router.get('/favourites', getFavourites);
router.post('/favourites', addFavourite);
router.delete('/favourites/:category/:id', removeFavourite);

// ── Enquiry history ───────────────────────────────────────────────
router.get('/enquiries', getUserEnquiries);       // spec: GET /account/enquiries

export default router;
