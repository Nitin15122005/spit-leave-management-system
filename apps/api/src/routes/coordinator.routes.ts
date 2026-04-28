import { Router } from 'express';
import {
  getApprovedLeaves,
  markAttendanceAndAcknowledge,
  getCompletedLeaves,
} from '../controllers/coordinator.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { markAttendanceSchema } from '../config/validation';

const router = Router();

router.use(authenticate, authorize('coordinator'));

// GET /api/coordinator/approved
router.get('/approved', getApprovedLeaves);

// GET /api/coordinator/completed
router.get('/completed', getCompletedLeaves);

// POST /api/coordinator/mark-attendance/:leaveId
router.post('/mark-attendance/:leaveId', validate(markAttendanceSchema), markAttendanceAndAcknowledge);

export default router;
