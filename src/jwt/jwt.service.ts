import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/app/entities/user.entity';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly nestJwtService: NestJwtService) {}

  createAccessToken(user: UserEntity) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    return {
      accessToken: this.nestJwtService.sign(payload),
    };
  }
}
