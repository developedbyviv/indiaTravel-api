import mongoose, { Schema, Document } from 'mongoose';

export interface IEat extends Document {
  name: string;
  city: string;
  cuisine: string;
  image: string;
  description: string;
  rating?: number;
  priceRange?: string;
  address?: string;
  tags?: string[];
}

const EatSchema = new Schema<IEat>(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 },
    priceRange: { type: String },
    address: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

EatSchema.index({ name: 'text', description: 'text', cuisine: 'text' });

export default mongoose.model<IEat>('Eat', EatSchema);
