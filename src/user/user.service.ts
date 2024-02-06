import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async findAll(): Promise<User[] | null> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
