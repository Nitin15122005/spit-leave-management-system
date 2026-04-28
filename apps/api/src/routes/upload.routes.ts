import { Router } from 'express';
import { upload, uploadProof } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// POST /api/upload/proof
// Returns a URL that can be stored as proof_link in the leave application
router.post('/proof', upload.single('file'), uploadProof);

export default router;
