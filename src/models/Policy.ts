import mongoose, { Schema, Document } from 'mongoose';

export interface IPolicy extends Document {
  key: string;        // e.g. 'privacy', 'refund', 'cancellation', 'payment'
  title: string;
  content: string;
  updatedAt: Date;
}

const PolicySchema = new Schema<IPolicy>(
  {
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPolicy>('Policy', PolicySchema);
