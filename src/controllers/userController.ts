import { Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Enquiry from '../models/Enquiry';
import { AuthRequest } from '../middleware/auth';

// GET /api/user/profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password -otp');
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    res.json({ success: true, data: user });
  } catch { res.status(500).json({ success: false, message: 'Failed to get profile' }); }
};

// PUT /api/user/profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, avatar },
      { new: true, runValidators: true }
    ).select('-password -otp');
    res.json({ success: true, data: user });
  } catch { res.status(500).json({ success: false, message: 'Failed to update profile' }); }
};

// PUT /api/user/change-password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) { res.status(400).json({ success: false, message: 'Current password is incorrect' }); return; }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch { res.status(500).json({ success: false, message: 'Failed to change password' }); }
};

// DELETE /api/user/account
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.json({ success: true, message: 'Account deleted' });
  } catch { res.status(500).json({ success: false, message: 'Failed to delete account' }); }
};

// ── Cart ──────────────────────────────────────────────────────────────

// GET /api/user/cart
export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('cart');
    res.json({ success: true, data: user?.cart || [] });
  } catch { res.status(500).json({ success: false, message: 'Failed to get cart' }); }
};

// POST /api/user/cart
export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tourId, title, location, image } = req.body;
    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }

    const alreadyInCart = user.cart.some((item) => item.tourId === tourId);
    if (alreadyInCart) {
      res.status(409).json({ success: false, message: 'Tour already in cart' });
      return;
    }

    user.cart.push({ tourId, title, location, image });
    await user.save();
    res.status(201).json({ success: true, data: user.cart });
  } catch { res.status(500).json({ success: false, message: 'Failed to add to cart' }); }
};

// DELETE /api/user/cart/:id
export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }

    user.cart = user.cart.filter((item) => item.tourId !== req.params.id);
    await user.save();
    res.json({ success: true, data: user.cart });
  } catch { res.status(500).json({ success: false, message: 'Failed to remove from cart' }); }
};

// ── Favourites ────────────────────────────────────────────────────────

// GET /api/user/favourites
export const getFavourites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('favourites');
    res.json({ success: true, data: user?.favourites || [] });
  } catch { res.status(500).json({ success: false, message: 'Failed to get favourites' }); }
};

// POST /api/user/favourites
export const addFavourite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemId, title, description, image, location, category } = req.body;
    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }

    const exists = user.favourites.some((f) => f.itemId === itemId && f.category === category);
    if (exists) { res.status(409).json({ success: false, message: 'Already in favourites' }); return; }

    user.favourites.unshift({ itemId, title, description, image, location, category });
    await user.save();
    res.status(201).json({ success: true, data: user.favourites });
  } catch { res.status(500).json({ success: false, message: 'Failed to add favourite' }); }
};

// DELETE /api/user/favourites/:category/:id
export const removeFavourite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, id } = req.params;
    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }

    user.favourites = user.favourites.filter(
      (f) => !(f.itemId === id && f.category === category)
    );
    await user.save();
    res.json({ success: true, data: user.favourites });
  } catch { res.status(500).json({ success: false, message: 'Failed to remove favourite' }); }
};

// ── Enquiries ────────────────────────────────────────────────────────

// GET /api/user/enquiries
export const getUserEnquiries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const enquiries = await Enquiry.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch { res.status(500).json({ success: false, message: 'Failed to get enquiries' }); }
};
