import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<
    Pick<User, 'id' | 'name' | 'email' | 'image'> & { accessToken: string }
  > {
    const user = await this.userService.findByEmail(email);
    if (user && (await argon2.verify(user.password, password))) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        accessToken: await this.jwtService.signAsync(
          {
            id: user.id,
          },
          {
            secret: process.env.JWT_SECRET_KEY,
          },
        ),
      };
    }

    throw new Error('failed login');
  }

  async register(
    dto: CreateUserDto,
  ): Promise<Pick<User, 'id' | 'name' | 'email'>> {
    return await this.userService.create(dto);
  }
}
