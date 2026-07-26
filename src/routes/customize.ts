import { Router } from 'express';
import { getCustomizeMeta, createCustomizeEnquiry } from '../controllers/customizeController';

const router = Router();

// GET /customize/meta
router.get('/meta', getCustomizeMeta);

// POST /customize/enquiries
router.post('/enquiries', createCustomizeEnquiry);

export default router;
