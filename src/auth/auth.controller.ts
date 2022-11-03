import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    return this.jwtService.createAccessToken(req.user);
  }
}
