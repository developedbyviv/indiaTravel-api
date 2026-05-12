import { Request, Response } from 'express';
import Blog from '../models/Blog';

// GET /api/blogs
export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    // Return summaries — exclude full content array for performance
    const blogs = await Blog.find(filter).select('-content');
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
};

// GET /api/blogs/:slug
export const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog' });
  }
};
