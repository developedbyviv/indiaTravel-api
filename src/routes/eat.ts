import { Router } from 'express';
import { getEatPlaces } from '../controllers/eatController';

const router = Router();

// GET /eat
router.get('/', getEatPlaces);

export default router;
