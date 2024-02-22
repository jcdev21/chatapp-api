import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { verifyPassword } from 'src/utils/authentication';
import * as crypto from 'crypto';
import { RefreshDataType } from 'src/types/refresh';
import { PayloadJWTAccessTokenType } from 'src/types/jwt';
import { ACCESS_AND_REFRESH_TOKEN } from 'src/types/token';

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

  async verifyUser(
    email: string,
    password: string,
  ): Promise<Pick<User, 'id' | 'email'>> {
    const user = await this.userService.findByEmail(email);
    if (user) {
      if (await verifyPassword(user.password, password)) {
        return {
          id: user.id,
          email: user.email,
        };
      }
    }

    throw new Error('invalid email and/or password');
  }

  async createToken({
    id,
    email,
  }: Pick<User, 'id' | 'email'>): Promise<ACCESS_AND_REFRESH_TOKEN> {
    const refreshId = id + process.env.JWT_SECRET_KEY;
    const { refreshToken, refreshKey } = this.generateRefreshToken(refreshId);
    const accessToken = await this.generateAccessToken(
      {
        id,
        email,
        refreshKey,
      },
      process.env.JWT_SECRET_KEY as string,
      '10m',
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateRefreshToken(refreshId: string): RefreshDataType {
    const salt = crypto.createSecretKey(crypto.randomBytes(16));
    const hash = crypto
      .createHmac('sha512', salt)
      .update(refreshId)
      .digest('base64');
    const refreshKey = salt.export();
    return {
      refreshToken: hash,
      refreshKey,
    };
  }

  private async generateAccessToken(
    payload: PayloadJWTAccessTokenType,
    secret: string,
    expiredTime?: number | string,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiredTime,
    });
  }
}
