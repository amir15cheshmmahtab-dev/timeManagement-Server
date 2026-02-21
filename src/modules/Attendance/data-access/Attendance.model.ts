import mongoose, { Document, Schema } from 'mongoose';

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'wfh';
export type BreakType = 'coffee' | 'lunch' | 'other';

export interface IBreak {
    startTime: Date;
    endTime: Date | null;
    type: BreakType;
}

export interface IAttendance extends Document {
    userId: mongoose.Types.ObjectId;
    date: Date;
    checkIn: Date | null;
    checkOut: Date | null;
    status: AttendanceStatus;
    workHours: number | null;
    isWfh: boolean;
    notes: string | null;
    breaks: IBreak[];
}

const BreakSchema = new Schema<IBreak>(
    {
        startTime: { type: Date, required: true },
        endTime:   { type: Date, default: null },
        type:      { type: String, enum: ['coffee', 'lunch', 'other'], required: true },
    },
    { _id: false }
);

const AttendanceSchema = new Schema<IAttendance>(
    {
        userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date:      { type: Date, required: true },
        checkIn:   { type: Date, default: null },
        checkOut:  { type: Date, default: null },
        status:    { type: String, enum: ['present', 'late', 'absent', 'wfh'], default: 'absent' },
        workHours: { type: Number, default: null },
        isWfh:     { type: Boolean, default: false },
        notes:     { type: String, default: null },
        breaks:    { type: [BreakSchema], default: [] },
    },
    {
        timestamps: true,
    }
);

// One record per user per day
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export const AttendanceModel = mongoose.model<IAttendance>('Attendance', AttendanceSchema);