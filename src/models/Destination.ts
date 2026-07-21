import mongoose, { Schema, Document } from 'mongoose';

export interface IDestination extends Document {
  slug: string;
  name: string;
  region: string;
  image: string;
  description: string;
  highlights: string[];
  featuredTours: mongoose.Types.ObjectId[];
}

const DestinationSchema = new Schema<IDestination>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    featuredTours: [{ type: Schema.Types.ObjectId, ref: 'Tour' }],
  },
  { timestamps: true }
);

DestinationSchema.index({ name: 'text', description: 'text', region: 'text' });

export default mongoose.model<IDestination>('Destination', DestinationSchema);
