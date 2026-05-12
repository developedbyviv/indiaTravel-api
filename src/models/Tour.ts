import mongoose, { Schema, Document } from 'mongoose';

// ──── Sub-schemas ────────────────────────────────────────────────

const ItineraryDaySchema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    startTime: { type: String, required: true },
    sightseeing: [{ type: String }],
    activities: [{ type: String }],
    foodStop: { type: String },
    departure: { type: String },
    image: { type: String },
  },
  { _id: false }
);

const ReviewSchema = new Schema(
  {
    author: { type: String, required: true },
    avatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: String },
    content: { type: String, required: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

// ──── Tour Document ──────────────────────────────────────────────

export interface ITour extends Document {
  title: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  category: 'handpicked' | 'golden-triangle' | 'same-day';
  inclusions: string[];
  exclusions: string[];
  itinerary: {
    day: number;
    title: string;
    startTime: string;
    sightseeing: string[];
    activities?: string[];
    foodStop?: string;
    departure?: string;
    image?: string;
  }[];
  reviewsList: {
    author: string;
    avatar?: string;
    rating: number;
    date?: string;
    content: string;
    images?: string[];
  }[];
}

const TourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ['handpicked', 'golden-triangle', 'same-day'],
    },
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    itinerary: [ItineraryDaySchema],
    reviewsList: [ReviewSchema],
  },
  { timestamps: true }
);

export default mongoose.model<ITour>('Tour', TourSchema);
