import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  slug: string;
  title: string;
  image: string;
  date: string;
  readTime: string;
  location: string;
  description: string;
  category: string;
  content: string[];
}

const BlogSchema = new Schema<IBlog>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: String, required: true },
    readTime: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    content: [{ type: String }],
  },
  { timestamps: true }
);

// Full-text search index on title and description
BlogSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IBlog>('Blog', BlogSchema);
