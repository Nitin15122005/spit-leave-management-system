import { Router } from 'express';
import { loginController, getMeController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { loginSchema } from '../config/validation';

const router = Router();

// POST /api/auth/login
router.post('/login', validate(loginSchema), loginController);

// GET /api/auth/me  (verify token + get user info)
router.get('/me', authenticate, getMeController);

export default router;
