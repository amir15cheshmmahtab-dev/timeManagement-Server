import jwt, { SignOptions } from 'jsonwebtoken';
import UserModel, { IUser } from '../data-access/auth.model';
import {
  LoginDto,
  CreateUserDto,
  TokenPayload,
  AuthTokens,
} from '../entry-point/auth.types';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

// Session timeout: 15 minutes of inactivity
const ACCESS_TOKEN_EXPIRES_IN = '15m';
// Refresh token lives longer
const REFRESH_TOKEN_EXPIRES_IN = '7d';

class AuthService {
  // ── Token Helpers ────────────────────────────────────────────────────────────

  private generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    } as SignOptions);
  }

  private generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    } as SignOptions);
  }

  private buildTokens(user: IUser): AuthTokens {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  // ── Public Methods ───────────────────────────────────────────────────────────

  /**
   * Register a new user (Admin operation).
   */
   public async create(dto: CreateUserDto) {
    const existing = await UserModel.findOne({ username: dto.username.toLowerCase() });
    if (existing) throw new Error('Username already taken');

    const user = await UserModel.create({
      username: dto.username,
      password: dto.password,
      role: dto.role ?? 'Employee',
    });

    return user;
  }

  /**
   * Login with username + password. Returns access & refresh tokens.
   */
  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await UserModel.findOne({ username: dto.username.toLowerCase() });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await user.comparePassword(dto.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const tokens = this.buildTokens(user);

    // Persist refresh token & update lastActivity
    user.refreshToken = tokens.refreshToken;
    user.lastActivity = new Date();
    await user.save();

    return tokens;
  }

  /**
   * Issue new access + refresh tokens from a valid refresh token.
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    let payload: TokenPayload;
    try {
      payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as TokenPayload;
    } catch {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await UserModel.findById(payload.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Refresh token reuse detected or user not found');
    }

    // Session inactivity check (15 min)
    const SESSION_TIMEOUT_MS = 15 * 60 * 1000;
    if (
      user.lastActivity &&
      Date.now() - user.lastActivity.getTime() > SESSION_TIMEOUT_MS
    ) {
      // Revoke token and force re-login
      user.refreshToken = undefined;
      await user.save();
      throw new Error('Session expired due to inactivity. Please login again.');
    }

    const tokens = this.buildTokens(user);

    user.refreshToken = tokens.refreshToken;
    user.lastActivity = new Date();
    await user.save();

    return tokens;
  }

  /**
   * Logout: revoke refresh token.
   */
  async logout(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      refreshToken: null,
    });
  }

  /**
   * Update lastActivity timestamp (called by middleware on each request).
   */
  async touchActivity(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { lastActivity: new Date() });
  }

  /**
   * Get user by ID (for profile, guards, etc.)
   */
  async findById(userId: string): Promise<IUser | null> {
    return UserModel.findById(userId);
  }
}

export default AuthService;
