
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateCreateUser {
    @IsNotEmpty()
    @IsString()
    username!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}

export const validateCreateUser = ValidateCreateUser;

export class ValidateLogout {
    @IsNotEmpty()
    @IsString()
    userId!: string;
}

export const validateLogout = ValidateLogout;

export class ValidateLogin {
    @IsNotEmpty()
    @IsString()
    userId!: string;
}

export const validateLogin = ValidateLogin;


export class ValidateRefreshToken {
    @IsNotEmpty()
    @IsString()
    refreshToken!: string;
}

export const validateRefreshToken = ValidateRefreshToken;

