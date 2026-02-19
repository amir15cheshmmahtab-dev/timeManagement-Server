import { UserRole } from '../data-access/auth.model';

export interface LoginDto {
  username: string;
  password: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  role?: UserRole;
}

export interface TokenPayload {
  userId: string;
  username: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}