import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel from '@/modules/Auth/data-access/auth.model';

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env');
  process.exit(1);
}

const adminData = [
  { username: 'Sarah Johnson', password: 'admin123', role: 'Admin' },
  { username: 'Marcus Chen', password: 'manager123', role: 'Manager' },
  { username: 'Emily Rodriguez', password: 'emp123', role: 'Employee' },
];

export const seed = async () => {
  try {
    console.log('Connecting to:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding');

    await seedUsers();
  } catch (err) {
    console.error('Seeder error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

async function seedUsers() {
  const existing = await UserModel.findOne({ role: 'Admin' });
  if (existing) {
    console.log('Admin users already exist, skipping...');
    return;
  }

  for (const user of adminData) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await UserModel.create({
      username: user.username,
      password: hashedPassword,
      role: user.role,
    });
    console.log(`✅ Created ${user.role}: ${user.username}`);
  }

  console.log('All users created successfully');
}

seed().then(() => {
  console.log('Seeding complete');
  process.exit(0);
});