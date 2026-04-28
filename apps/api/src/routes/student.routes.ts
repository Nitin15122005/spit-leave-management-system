import { Router } from 'express';
import { getStudentLeaves, getStudentProfile, applyLeave } from '../controllers/student.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { applyLeaveSchema } from '../config/validation';

const router = Router();

router.use(authenticate, authorize('student'));

// GET /api/student/profile
router.get('/profile', getStudentProfile);

// GET /api/student/leaves
router.get('/leaves', getStudentLeaves);

// POST /api/student/leaves
router.post('/leaves', validate(applyLeaveSchema), applyLeave);

export default router;
