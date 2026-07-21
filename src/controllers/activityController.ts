import { Request, Response } from 'express';
import Activity from '../models/Activity';

// GET /activities
export const getActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tag, destination, q } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};

    if (q) filter['$text'] = { $search: q };
    if (tag) filter.tag = { $regex: tag, $options: 'i' };
    if (destination) filter.destination = { $regex: destination, $options: 'i' };

    const activities = await Activity.find(filter)
      .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

    res.json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch activities' });
  }
};
