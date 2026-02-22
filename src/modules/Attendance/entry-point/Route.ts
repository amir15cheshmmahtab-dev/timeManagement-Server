import { Router } from 'express';
import { attendanceController } from './attendance.controller';
import validationMiddleware from "@/middlewares/validation/validation";
import { authenticate } from "@/shared/middleware/authenticate";

import {
    validateCheckIn,
    validateCheckOut,
    validateStartBreak,
    validateEndBreak,
} from './attendance.validation';

class AttendanceRoute {
    public path = '/v1/attendance';
    public router = Router();
    public controller = attendanceController;
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/check-in`, [authenticate,validationMiddleware(validateCheckIn)], this.controller.checkIn);
        this.router.post(`${this.path}/check-out`, [authenticate,validationMiddleware(validateCheckOut)], this.controller.checkOut);
        this.router.post(`${this.path}/break/start`, [authenticate,validationMiddleware(validateStartBreak)], this.controller.startBreak);
        this.router.post(`${this.path}/break/end`, [authenticate,validationMiddleware(validateEndBreak)], this.controller.endBreak);
        this.router.get(`${this.path}/:userId/today`, this.controller.getToday);
        this.router.get(`${this.path}/:userId/history`, this.controller.getHistory);
    }
}

export default AttendanceRoute; 
