import { Request, Response } from 'express';
import Eat from '../models/Eat';

// GET /eat
export const getEatPlaces = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city, cuisine, q } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};

    if (q) filter['$text'] = { $search: q };
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (cuisine) filter.cuisine = { $regex: cuisine, $options: 'i' };

    const places = await Eat.find(filter)
      .sort(q ? { score: { $meta: 'textScore' } } : { rating: -1 });

    res.json({ success: true, count: places.length, data: places });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch eating places' });
  }
};
