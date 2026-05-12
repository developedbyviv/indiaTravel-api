import { Router } from 'express';
import {
  createItineraryEnquiry,
  createCustomEnquiry,
  createCartEnquiry,
} from '../controllers/enquiryController';
import { validate } from '../middleware/validate';
import {
  itineraryEnquirySchema,
  customEnquirySchema,
  cartEnquirySchema,
} from '../schemas/enquirySchema';

const router = Router();

// Standard itinerary enquiry
router.post('/', validate(itineraryEnquirySchema), createItineraryEnquiry);

// Custom tour planner enquiry
router.post('/custom', validate(customEnquirySchema), createCustomEnquiry);

// Trip cart enquiry
router.post('/cart', validate(cartEnquirySchema), createCartEnquiry);

export default router;
