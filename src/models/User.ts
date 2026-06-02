import mongoose, { Schema, Document } from 'mongoose';

// ──── Sub-schemas ────────────────────────────────────────────────

const CartItemSchema = new Schema(
  {
    tourId: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String },
  },
  { _id: false }
);

const FavouriteItemSchema = new Schema(
  {
    itemId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    location: { type: String },
    category: {
      type: String,
      enum: ['tours', 'eat', 'activities', 'blogs'],
      required: true,
    },
  },
  { _id: false }
);

// ──── OTP sub-schema ─────────────────────────────────────────────

const OtpSchema = new Schema(
  {
    code: { type: String },
    expiresAt: { type: Date },
  },
  { _id: false }
);

// ──── User Document ──────────────────────────────────────────────

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  password?: string;
  authProvider?: 'local' | 'google';
  cart: { tourId: string; title: string; location: string; image?: string }[];
  favourites: {
    itemId: string;
    title: string;
    description?: string;
    image?: string;
    location?: string;
    category: 'tours' | 'eat' | 'activities' | 'blogs';
  }[];
  otp?: { code?: string; expiresAt?: Date };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    avatar: { type: String },
    password: { type: String, minlength: 6 },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    cart: [CartItemSchema],
    favourites: [FavouriteItemSchema],
    otp: OtpSchema,
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
