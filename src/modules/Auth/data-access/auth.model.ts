import { Schema, model, Document } from 'mongoose';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'Admin' | 'Manager' | 'Employee';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  password?: string;
  role: UserRole;
  refreshToken?: string;
  lastActivity?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Employee'],
      default: 'Employee',
    },
    refreshToken: {
      type: String,
      default: null,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const UserModel = model<IUser>('User', UserSchema);
export default UserModel;
