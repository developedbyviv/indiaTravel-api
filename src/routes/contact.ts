import { Router } from 'express';
import { createContactEnquiry } from '../controllers/contactController';
import { validate } from '../middleware/validate';
import { contactEnquirySchema } from '../schemas/contactSchema';

const router = Router();

// POST /contact/enquiries
router.post('/enquiries', validate(contactEnquirySchema), createContactEnquiry);

export default router;
