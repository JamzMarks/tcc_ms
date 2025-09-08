import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Roles, User } from 'generated/prisma/client';
import { hashPassword } from '@utils/HashPassword';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const users = await this.prisma.user.count();
    if (users === 0) {
      const hash = await hashPassword('Admin123!');

      await this.prisma.user.create({
        data: {
          email: 'admin@system.local',
          password: hash,
          role: Roles.ADMIN,
          firstName: 'Admin',
          lastName: 'System',
        },
      });
      console.log('✅ Default admin created.');
    }
  }

  async findUsers(): Promise<Omit<User, 'password' | 'isActive'>[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });
  }

  async findUserById(
    id: string,
  ): Promise<Omit<User, 'password' | 'isActive'> | null> {
    const user = this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(
    email: string,
  ): Promise<Omit<User, 'password' | 'isActive'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });
    if (!user)
      throw new NotFoundException('User not found');
    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const email = data.email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw new BadRequestException('Email already in use');

    const hashedPassword = await hashPassword(data.password);
    return this.prisma.user.create({
      data: {
        ...data,
        email,
        password: hashedPassword,
      },
    });
  }

  async updateUser(id: string, data: Partial<UserDto>): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { email } = data;
    if (email) {
      data.email = email.trim().toLowerCase();
    }
    return this.prisma.user.update({
      data: data,
      where: { id },
    });
  }

  async UpdateUserPassword(id: string, newPassword: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const hashedPassword = await hashPassword(newPassword);
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getUsersRoles(): Promise<string[]> {
    return Object.values(Roles);
  }
}
