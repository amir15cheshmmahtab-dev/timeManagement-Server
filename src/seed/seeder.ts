import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel from '@/modules/Auth/data-access/auth.model';
import Locals from '@/providers/Locals';

const adminData = [
  {
    username: 'Sarah Johnson',
    password: 'admin123',
    role: 'Admin',
  },
  {
    username: 'Marcus Chen',
    password: 'manager123',
    role: 'Manager',
  },
  {
    username: 'Emily Rodriguez',
    password: 'emp123',
    role: 'Employee',
  },
];

export const seed = async () => {
  try {
    const { mongoUri } = Locals.config();

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding');

    await seedAdmins();

    console.log('Admin users seeded successfully');
  } catch (err) {
    console.error('Seeder error:', err);
  }
};

async function seedAdmins() {
  const existing = await UserModel.findOne({ role: 'Admin' });
  if (existing) {
    console.log('Admin users already exist, skipping...');
    return;
  }

  try {
    for (const admin of adminData) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      await UserModel.create({
        username: admin.username,
        password: hashedPassword,
        role: admin.role,
      });
      console.log(`✅ Created ${admin.role}: ${admin.username}`);
    }

    console.log('All admin users created successfully');
  } catch (err) {
    console.error('Error seeding admin users:', err);
  }
}