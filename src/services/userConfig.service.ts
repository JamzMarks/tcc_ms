import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from 'generated/prisma';
import { UserConfigDto } from '@dtos/userConfig/user-config.dto';
import { CreateUserConfigDto } from '@dtos/userConfig/create-user-config.dto';

@Injectable()
export class UserConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async fingUserConfig(id: string): Promise<UserConfigDto> {
    const config = await this.prisma.userConfig.findUnique({
      where: {
        id,
      },
    });
    if (!config) throw new NotFoundException('User not found');
    return config;
  }

  async fingUserConfigByUser(userId: string): Promise<UserConfigDto> {
    const config = await this.prisma.userConfig.findUnique({
      where: {
        userId,
      },
    });
    if (!config) throw new NotFoundException('User not found');
    return config;
  }

  async createUserConfig(data: CreateUserConfigDto): Promise<UserConfigDto> {
    try {
      const newConfig = await this.prisma.userConfig.create({
        data: {
          userId: data.userId,
          language: data.language,
          theme: data.theme,
        },
      });
      return newConfig;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User config not found');
      }
      throw error;
    }
  }

  async updateUserConfig(
    configId: string,
    data: Partial<UserConfigDto>,
  ): Promise<UserConfigDto> {
    const config = await this.prisma.userConfig.findUnique({
      where: { id: configId },
    });

    if (!config) {
      throw new NotFoundException('User config not found');
    }

    const { userId, id, ...newConfigs } = data;

    const newConfig = await this.prisma.userConfig.update({
      data: newConfigs,
      where: { id: configId },
    });

    return newConfig;
  }

  async deleteUserConfig(userId: string): Promise<void> {
    try {
      await this.prisma.userConfig.delete({
        where: {
          userId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User config not found');
      }
      throw error;
    }
  }
}
