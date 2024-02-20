import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { verifyPassword } from 'src/utils/authentication';

// contoh penggunaan middeware untuk transformasi request
@Injectable()
export class VerifyUserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('middleware', req.body);

    const user = await this.userService.findByEmail(req.body.email);

    if (user) {
      if (await verifyPassword(user.password, req.body.password)) {
        req.body = {
          id: user.id,
          email: user.email,
        };
        return next();
      }
    }

    return res.status(HttpStatus.BAD_REQUEST).json({
      status: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid email and/or password',
    });
  }
}
