import { Request, Response } from 'express';
import Tour from '../models/Tour';
import { AuthRequest } from '../middleware/auth';

// GET /api/tours
export const getTours = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      q,
      region,
      category,
      ratingMin,
      page = '1',
      pageSize = '20',
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};

    if (q) {
      filter['$text'] = { $search: q };
    }
    if (region) filter.region = { $regex: region, $options: 'i' };
    if (category) filter.category = category;
    if (ratingMin) filter.rating = { $gte: parseFloat(ratingMin) };

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limit = Math.min(parseInt(pageSize, 10) || 20, 100);
    const skip = (pageNum - 1) * limit;

    const [tours, total] = await Promise.all([
      Tour.find(filter)
        .select('-itinerary -reviewsList -inclusions -exclusions')
        .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Tour.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: pageNum,
      pageSize: limit,
      pages: Math.ceil(total / limit),
      data: tours,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tours' });
  }
};

// GET /api/tours/:id
export const getTourById = async (req: Request, res: Response): Promise<void> => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      res.status(404).json({ success: false, message: 'Tour not found' });
      return;
    }
    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tour' });
  }
};

// POST /api/tours/:id/reviews  (requires auth)
export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rating, content, images } = req.body;
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      res.status(404).json({ success: false, message: 'Tour not found' });
      return;
    }

    const newReview = {
      author: req.userId || 'Anonymous',
      rating,
      content,
      images: images || [],
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };

    tour.reviewsList.push(newReview as typeof tour.reviewsList[0]);

    // Recalculate average rating
    const total = tour.reviewsList.reduce((sum, r) => sum + r.rating, 0);
    tour.rating = Math.round((total / tour.reviewsList.length) * 10) / 10;
    tour.reviews = tour.reviewsList.length;

    await tour.save();
    res.status(201).json({ success: true, data: tour.reviewsList.at(-1) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add review' });
  }
};
