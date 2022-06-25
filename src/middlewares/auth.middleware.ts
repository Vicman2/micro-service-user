import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthRequest } from 'src/common/interfaces/req.interface';
import { decryptData } from 'src/common/utilizers/util.utilizer';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    //Logic for authentication goes in here
    const token = req.headers['x-auth-token'];
    if (!token) throw new UnauthorizedException(null, 'No token provided');
    if (typeof token !== 'string')
      throw new UnauthorizedException(null, 'String token expected');
    try {
      const decoded = await decryptData(token);
      const user = await this.userService.findGeneralUserById(decoded.id);
      if (!user) {
        throw new UnauthorizedException(null, 'User is not authorized');
      }
      // check if user is verified
      if (!user.isVerified)
        throw new UnauthorizedException(null, 'User is not verified');

      req.user = user;
      next();
    } catch (error: any) {
      const errors = [
        'TokenExpiredError',
        'NotBeforeError',
        'JsonWebTokenError',
      ];
      if (errors.includes(error?.name)) {
        throw new UnauthorizedException(null, 'Please authenticate');
      }
      next(error);
    }
  }
}
