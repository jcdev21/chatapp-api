import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateUserDto,
  ): Promise<Pick<User, 'id' | 'name' | 'email'>> {
    return await this.prisma.user.create({
      select: {
        id: true,
        name: true,
        email: true,
      },
      data: {
        ...dto,
        password: await argon2.hash(dto.password),
      },
    });
  }

  async findAll(): Promise<
    Pick<User, 'id' | 'email' | 'name' | 'image'>[] | null
  > {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });
  }

  async findOne(
    id: string,
  ): Promise<Pick<User, 'id' | 'email' | 'name' | 'image'> | null> {
    return await this.prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}
