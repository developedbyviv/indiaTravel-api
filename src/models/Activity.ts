import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  description: string;
  image: string;
  tag: string;
  destination: string;
  price?: number;
  duration?: string;
  difficulty?: 'easy' | 'moderate' | 'hard';
}

const ActivitySchema = new Schema<IActivity>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    tag: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    price: { type: Number },
    duration: { type: String },
    difficulty: { type: String, enum: ['easy', 'moderate', 'hard'] },
  },
  { timestamps: true }
);

ActivitySchema.index({ title: 'text', description: 'text', tag: 'text' });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
