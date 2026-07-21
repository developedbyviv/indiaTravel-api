import { Router } from 'express';
import { getDestinations, getDestinationBySlug } from '../controllers/destinationController';

const router = Router();

// GET /destinations
router.get('/', getDestinations);

// GET /destinations/:slug
router.get('/:slug', getDestinationBySlug);

export default router;
