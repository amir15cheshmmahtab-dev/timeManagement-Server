import { Router } from 'express';
import { attendanceController } from './attendance.controller';
import { validateRequest } from '../../shared/middlewares/validateRequest'; 
import {validateCheckIn,validateCheckOut,validateStartBreak,validateEndBreak,} from './attendance.validation';

const router = Router();

// POST /attendance/check-in
router.post('/check-in',    validateRequest(validateCheckIn),    attendanceController.checkIn);

// POST /attendance/check-out
router.post('/check-out',   validateRequest(validateCheckOut),   attendanceController.checkOut);

// POST /attendance/break/start
router.post('/break/start', validateRequest(validateStartBreak), attendanceController.startBreak);

// POST /attendance/break/end
router.post('/break/end',   validateRequest(validateEndBreak),   attendanceController.endBreak);

// GET /attendance/:userId/today
router.get('/:userId/today',   attendanceController.getToday);

// GET /attendance/:userId/history?month=2&year=2025
router.get('/:userId/history', attendanceController.getHistory);

export default router;