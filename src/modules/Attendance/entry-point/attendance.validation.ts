import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { BreakType } from '../data-access/Attendance.model';

export class ValidateCheckIn {
    @IsNotEmpty()
    @IsString()
    userId!: string;

    @IsBoolean()
    @IsOptional()
    isWfh?: boolean;

    @IsString()
    @IsOptional()
    notes?: string;
}

export const validateCheckIn = ValidateCheckIn;

export class ValidateCheckOut {
    @IsNotEmpty()
    @IsString()
    userId!: string;
}

export const validateCheckOut = ValidateCheckOut;

export class ValidateStartBreak {
    @IsNotEmpty()
    @IsString()
    userId!: string;

    @IsNotEmpty()
    @IsEnum(['coffee', 'lunch', 'other'])
    type!: BreakType;
}

export const validateStartBreak = ValidateStartBreak;

export class ValidateEndBreak {
    @IsNotEmpty()
    @IsString()
    userId!: string;
}

export const validateEndBreak = ValidateEndBreak;

export class ValidateGetHistory {
    @IsNotEmpty()
    @IsString()
    userId!: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(12)
    month?: number;

    @IsOptional()
    @IsInt()
    @Min(2000)
    year?: number;
}

export const validateGetHistory = ValidateGetHistory;