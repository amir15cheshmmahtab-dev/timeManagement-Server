import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import UserModel from '../../modules/Auth/data-access/auth.model';

interface JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

// ✅ Module augmentation instead of namespace
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('No token provided. Please log in.', 401));
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return next(new AppError('Server configuration error', 500));
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await UserModel.findById(decoded.id).select('role');
    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    req.user = {
      id: decoded.id,
      role: user.role,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError('Your session has expired. Please log in again.', 401));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    next(err);
  }
};