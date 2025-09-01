import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, User } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { hashPassword } from '@utils/HashPassword';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
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
    return this.prisma.user.findUnique({
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
  }
  async findByEmail(
    email: string,
  ): Promise<Omit<User, 'password' | 'isActive'> | null> {
    return this.prisma.user.findUnique({
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
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const email = data.email.trim().toLowerCase();
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
    const {email} = data;
    if(email){
      data.email = email.trim().toLowerCase();
    }
    return this.prisma.user.update({
      data: data,
      where: { id },
    });
  }

  async UpdateUserPassword(id: string, newPassword: string): Promise<User> {
    const hashedPassword = await hashPassword(newPassword);
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
