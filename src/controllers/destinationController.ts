import { Request, Response } from 'express';
import Destination from '../models/Destination';

// GET /destinations
export const getDestinations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, region } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};

    if (q) filter['$text'] = { $search: q };
    if (region) filter.region = { $regex: region, $options: 'i' };

    const destinations = await Destination.find(filter)
      .select('-featuredTours')
      .sort(q ? { score: { $meta: 'textScore' } } : { name: 1 });

    res.json({ success: true, count: destinations.length, data: destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch destinations' });
  }
};

// GET /destinations/:slug
export const getDestinationBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug })
      .populate('featuredTours', 'title location image rating reviews price category');

    if (!destination) {
      res.status(404).json({ success: false, message: 'Destination not found' });
      return;
    }

    res.json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch destination' });
  }
};
