import { ProducerService } from '@services/producer.service';
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
import { UserResponseDto } from 'src/dto/user-response.dto';
import { BrokerService } from './broker.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { parseRole } from '@utils/parseRole';
import { UserConfigService } from './userConfig.service';
import { CreateUserConfigDto } from '@dtos/userConfig/create-user-config.dto';
import { UsersFilters } from '@dtos/users-filters.dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private loggerService: BrokerService,
    private userConfigService: UserConfigService,
  ) {}

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

  async findUsers(filters: UsersFilters): Promise<UserResponseDto[]> {
    const { query, isActive, role, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const queryData: Prisma.UserWhereInput[] = [
      query ? {
        OR: [
              { email: { contains: query, mode: "insensitive" } },
              { firstName: { contains: query, mode: "insensitive" } },
              { lastName: { contains: query, mode: "insensitive" } },
            ],
      } : {},
      role ? { role } : {},
      isActive !== undefined ? { isActive } : {},
    ];

    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
        role: true,
        avatar: true,
      },
      where: {
          AND: queryData,
        },
        skip,
        take: limit,
    });
  }

  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
        role: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
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

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const email = data.email.toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw new BadRequestException('Email already in use');
    const role = data.role ? parseRole(data.role) : Roles.USER;
    const hashedPassword = await hashPassword(data.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          email,
          password: hashedPassword,
          role: role,
        },
      });
      const userConfig = this.userConfigService.createUserConfig({
        userId: user.id,
      } as CreateUserConfigDto);
      return user;
    } catch (error) {
      throw new Error(error);
    }
    // this.loggerService.log('Usuário criado', 'info', { action: 'create_user' });
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

  

  async deleteUser(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async deleteUserByEmail(email: string): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where: { email },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async getUsersRoles(): Promise<string[]> {
    return Object.values(Roles);
  }
}
