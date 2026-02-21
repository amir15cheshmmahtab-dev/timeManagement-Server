import { AttendanceStatus, BreakType } from '../data-access/attendance.model';

export interface ICheckInPayload {
    userId: string;
    isWfh: boolean;
    notes?: string;
}

export interface ICheckOutPayload {
    userId: string;
}

export interface IStartBreakPayload {
    userId: string;
    type: BreakType;
}

export interface IEndBreakPayload {
    userId: string;
}

export interface IGetHistoryPayload {
    userId: string;
    month?: number;   // 1-12
    year?: number;
}

export interface IAttendanceRecord {
    id: string;
    userId: string;
    date: Date;
    checkIn: Date | null;
    checkOut: Date | null;
    status: AttendanceStatus;
    workHours: number | null;
    isWfh: boolean;
    notes: string | null;
    breaks: {
        startTime: Date;
        endTime: Date | null;
        type: BreakType;
    }[];
}