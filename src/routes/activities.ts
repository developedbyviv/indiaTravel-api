import { Router } from 'express';
import { getActivities } from '../controllers/activityController';

const router = Router();

// GET /activities
router.get('/', getActivities);

export default router;
