import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayloadType } from 'src/types/jwt';
import { extractTokenFromHeader } from 'src/utils/authentication';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if ('refresh-token' in request.cookies) {
      const accessToken = extractTokenFromHeader(request) as string;
      const accessTokenDecoded = this.jwtService.decode(
        accessToken,
      ) as JwtPayloadType;

      if (accessTokenDecoded && accessTokenDecoded.exp < Date.now() / 1000) {
        const salt = crypto.createSecretKey(
          Buffer.from(accessTokenDecoded.refreshKey),
        );
        const hash = crypto
          .createHmac('sha512', salt)
          .update(
            accessTokenDecoded.id + this.configService.get('JWT_SECRET_KEY'),
          )
          .digest('base64');

        if (hash === request.cookies['refresh-token']) {
          request.body['email'] = accessTokenDecoded.email;
          return true;
        }
      }
    }

    throw new ForbiddenException();
  }
}
