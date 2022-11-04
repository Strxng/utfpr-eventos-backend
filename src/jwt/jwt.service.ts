import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly nestJwtService: NestJwtService) {}

  createAccessToken(userId: string, userEmail: string) {
    const payload = {
      id: userId,
      email: userEmail,
    };

    return 'Bearer ' + this.nestJwtService.sign(payload);
  }
}
