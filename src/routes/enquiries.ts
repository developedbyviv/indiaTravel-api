import { Router } from 'express';
import {
  createItineraryEnquiry,
  createCustomEnquiry,
  createCartEnquiry,
  createTripEnquiry,
  getTripOptions,
  getEnquiryById,
  getEnquiries,
} from '../controllers/enquiryController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  itineraryEnquirySchema,
  customEnquirySchema,
  cartEnquirySchema,
  tripEnquirySchema,
} from '../schemas/enquirySchema';

const router = Router();

// ── Trip options metadata (public) ────────────────────────────────
router.get('/trip/options', getTripOptions);             // spec: GET /enquiries/trip/options

// ── Submit enquiries ──────────────────────────────────────────────
router.post('/trip', validate(tripEnquirySchema), createTripEnquiry);           // spec: POST /enquiries/trip
router.post('/', validate(itineraryEnquirySchema), createItineraryEnquiry);     // legacy itinerary
router.post('/custom', validate(customEnquirySchema), createCustomEnquiry);     // legacy custom
router.post('/cart', validate(cartEnquirySchema), createCartEnquiry);           // legacy cart

// ── List & detail (auth required) ────────────────────────────────
router.get('/', protect, getEnquiries);                  // spec: GET /enquiries
router.get('/:id', protect, getEnquiryById);             // spec: GET /enquiries/:id

export default router;
