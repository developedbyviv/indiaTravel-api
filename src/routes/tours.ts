import { Router } from 'express';
import { getTours, getTourById, addReview } from '../controllers/tourController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { reviewSchema } from '../schemas/tourSchema';

const router = Router();

router.get('/', getTours);
router.get('/:id', getTourById);
router.post('/:id/reviews', protect, validate(reviewSchema), addReview);

export default router;
