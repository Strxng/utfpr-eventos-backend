import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err: any, user: any, info: any) {
    if (err || info || !user) {
      throw err || new UnauthorizedException(['Credenciais inválidas']);
    }
    return user;
  }
}
