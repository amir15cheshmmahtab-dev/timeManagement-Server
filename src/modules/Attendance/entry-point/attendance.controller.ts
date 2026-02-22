import { Request, Response } from 'express';
import { attendanceService } from '../domain/attendance.service';

export const attendanceController = {

    async checkIn(req: Request, res: Response): Promise<void> {
        try {
            const { userId, isWfh, notes } = req.body;
            const record = await attendanceService.checkIn({ userId, isWfh, notes });
            res.status(200).json({ success: true, data: record });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async checkOut(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            const record = await attendanceService.checkOut({ userId });
            res.status(200).json({ success: true, data: record });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async startBreak(req: Request, res: Response): Promise<void> {
        try {
            const { userId, type } = req.body;
            const record = await attendanceService.startBreak({ userId, type });
            res.status(200).json({ success: true, data: record });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async endBreak(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            const record = await attendanceService.endBreak({ userId });
            res.status(200).json({ success: true, data: record });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async getHistory(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const month = req.query.month ? Number(req.query.month) : undefined;
            const year  = req.query.year  ? Number(req.query.year)  : undefined;

            const records = await attendanceService.getHistory({ userId, month, year });
            res.status(200).json({ success: true, data: records });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async getToday(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const record = await attendanceService.getTodayRecord(userId);
            res.status(200).json({ success: true, data: record ?? null });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
};