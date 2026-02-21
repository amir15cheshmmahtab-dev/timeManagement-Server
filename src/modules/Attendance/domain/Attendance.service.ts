import { AttendanceModel, IAttendance } from '../data-access/attendance.model';
import {
    ICheckInPayload,
    ICheckOutPayload,
    IStartBreakPayload,
    IEndBreakPayload,
    IGetHistoryPayload,
} from '../entry-point/attendance.types';

const LATE_THRESHOLD_HOUR   = 9;  // 09:00 AM
const LATE_THRESHOLD_MINUTE = 0;

function getTodayDateOnly(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function computeWorkHours(checkIn: Date, checkOut: Date, breaks: IAttendance['breaks']): number {
    let totalMs = checkOut.getTime() - checkIn.getTime();

    for (const b of breaks) {
        if (b.startTime && b.endTime) {
            totalMs -= b.endTime.getTime() - b.startTime.getTime();
        }
    }

    return parseFloat((totalMs / (1000 * 60 * 60)).toFixed(2));
}

function resolveStatus(checkInTime: Date, isWfh: boolean): IAttendance['status'] {
    if (isWfh) return 'wfh';

    const isLate =
        checkInTime.getHours() > LATE_THRESHOLD_HOUR ||
        (checkInTime.getHours() === LATE_THRESHOLD_HOUR && checkInTime.getMinutes() > LATE_THRESHOLD_MINUTE);

    return isLate ? 'late' : 'present';
}

export const attendanceService = {

    async checkIn({ userId, isWfh = false, notes = null }: ICheckInPayload) {
        const today = getTodayDateOnly();

        const existing = await AttendanceModel.findOne({ userId, date: today });
        if (existing?.checkIn) {
            throw new Error('Already checked in for today');
        }

        const now    = new Date();
        const status = resolveStatus(now, isWfh);

        const record = await AttendanceModel.findOneAndUpdate(
            { userId, date: today },
            {
                $set: {
                    checkIn: now,
                    status,
                    isWfh,
                    notes: notes ?? null,
                    checkOut:  null,
                    workHours: null,
                },
            },
            { upsert: true, new: true }
        );

        return record;
    },

    async checkOut({ userId }: ICheckOutPayload) {
        const today = getTodayDateOnly();

        const record = await AttendanceModel.findOne({ userId, date: today });
        if (!record)         throw new Error('No check-in found for today');
        if (!record.checkIn) throw new Error('User has not checked in yet');
        if (record.checkOut) throw new Error('Already checked out for today');

        // Close any open break automatically
        const openBreak = record.breaks.find(b => !b.endTime);
        if (openBreak) openBreak.endTime = new Date();

        const now       = new Date();
        const workHours = computeWorkHours(record.checkIn, now, record.breaks);

        record.checkOut  = now;
        record.workHours = workHours;
        await record.save();

        return record;
    },

    async startBreak({ userId, type }: IStartBreakPayload) {
        const today = getTodayDateOnly();

        const record = await AttendanceModel.findOne({ userId, date: today });
        if (!record || !record.checkIn) throw new Error('Not checked in');
        if (record.checkOut)            throw new Error('Session already ended');

        const openBreak = record.breaks.find(b => !b.endTime);
        if (openBreak) throw new Error('A break is already active');

        record.breaks.push({ startTime: new Date(), endTime: null, type });
        await record.save();

        return record;
    },

    async endBreak({ userId }: IEndBreakPayload) {
        const today = getTodayDateOnly();

        const record = await AttendanceModel.findOne({ userId, date: today });
        if (!record || !record.checkIn) throw new Error('Not checked in');

        const openBreak = record.breaks.find(b => !b.endTime);
        if (!openBreak) throw new Error('No active break found');

        openBreak.endTime = new Date();
        await record.save();

        return record;
    },

    async getHistory({ userId, month, year }: IGetHistoryPayload) {
        const now         = new Date();
        const targetMonth = (month ?? now.getMonth() + 1) - 1; // convert to 0-indexed
        const targetYear  = year ?? now.getFullYear();

        const from = new Date(targetYear, targetMonth, 1);
        const to   = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

        return AttendanceModel.find({
            userId,
            date: { $gte: from, $lte: to },
        }).sort({ date: 1 });
    },

    async getTodayRecord(userId: string) {
        const today = getTodayDateOnly();
        return AttendanceModel.findOne({ userId, date: today });
    },
};