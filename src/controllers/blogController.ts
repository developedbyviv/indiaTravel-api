import { Request, Response } from 'express';
import Blog from '../models/Blog';

// GET /api/blogs
export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      q,
      tag,
      category,
      page = '1',
      pageSize = '20',
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};

    if (q) {
      filter['$text'] = { $search: q };
    }
    if (tag) filter.category = { $regex: tag, $options: 'i' };
    if (category) filter.category = category;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limit = Math.min(parseInt(pageSize, 10) || 20, 100);
    const skip = (pageNum - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select('-content')
        .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: pageNum,
      pageSize: limit,
      pages: Math.ceil(total / limit),
      data: blogs,
    });
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
