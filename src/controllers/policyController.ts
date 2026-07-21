import { Request, Response } from 'express';
import Policy from '../models/Policy';

// GET /policies
export const getPolicies = async (_req: Request, res: Response): Promise<void> => {
  try {
    const policies = await Policy.find({}).select('key title updatedAt').sort({ key: 1 });
    res.json({ success: true, count: policies.length, data: policies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch policies' });
  }
};

// GET /policies/:key
export const getPolicyByKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const key = (req.params as { key: string }).key.toLowerCase();
    const policy = await Policy.findOne({ key });
    if (!policy) {
      res.status(404).json({ success: false, message: 'Policy not found' });
      return;
    }
    res.json({ success: true, data: policy });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch policy' });
  }
};
