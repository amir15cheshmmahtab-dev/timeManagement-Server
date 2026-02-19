import { Request, Response, NextFunction } from 'express';
import AuthService from '../domain/auth.service';
import { CreateUserDto, LoginDto, RefreshTokenDto } from './auth.types';

const authService = new AuthService();

class AuthController {
  
  public async createUser (req: Request, res: Response, next: NextFunction) {
    try {
      const dto: CreateUserDto = req.body;
      if (!dto.username || !dto.password) {
        res.status(400).json({ message: 'username and password are required' });
        return;
      }
      const user = await authService.create(dto);
      res.status(201).json({ message: 'User created successfully', data: user });
    } catch (err: any) {
      next(err);
    }
  };

    public async login (req: Request, res: Response, next: NextFunction) {
    try {
      const dto: LoginDto = req.body;
      if (!dto.username || !dto.password) {
        res.status(400).json({ message: 'username and password are required' });
        return;
      }
      const tokens = await authService.login(dto);
      res.status(200).json({ message: 'Login successful', data: tokens });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  };

    public async logout (req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      await authService.logout(userId);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (err: any) {
      next(err);
    }
  };

  // Auto login with refresh token
    public async refresh (req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken }: RefreshTokenDto = req.body;
      if (!refreshToken) {
        res.status(400).json({ message: 'refreshToken is required' });
        return;
      }
      const tokens = await authService.refreshTokens(refreshToken);
      res.status(200).json({ message: 'Tokens refreshed', data: tokens });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  };

}

export default AuthController;