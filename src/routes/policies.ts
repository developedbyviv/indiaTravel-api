import { Router } from 'express';
import { getPolicies, getPolicyByKey } from '../controllers/policyController';

const router = Router();

// GET /policies
router.get('/', getPolicies);

// GET /policies/:key
router.get('/:key', getPolicyByKey);

export default router;
