import { Router } from 'express';
import {
  getPendingLeaves,
  approveLeave,
  rejectLeave,
  getApprovalHistory,
} from '../controllers/faculty.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { actionSchema } from '../config/validation';

const router = Router();

router.use(authenticate, authorize('teacher', 'hod', 'dean'));

// GET /api/faculty/pending
router.get('/pending', getPendingLeaves);

// GET /api/faculty/history
router.get('/history', getApprovalHistory);

// POST /api/faculty/approve/:leaveId
router.post('/approve/:leaveId', validate(actionSchema), approveLeave);

// POST /api/faculty/reject/:leaveId
router.post('/reject/:leaveId', validate(actionSchema), rejectLeave);

export default router;
