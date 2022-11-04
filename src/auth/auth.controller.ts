import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from 'src/app/endpoints/user/user.service';
import { UserToReponse } from 'src/app/endpoints/user/user.types';
import { JwtService } from 'src/jwt/jwt.service';
import { AccessToken } from './auth.types';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    const userDetails = await this.userService.getUserDetails(req.user.id);
    const accessToken = this.jwtService.createAccessToken(
      userDetails.id,
      userDetails.email,
    );

    const userToResponse: UserToReponse & AccessToken = {
      id: userDetails.id,
      name: userDetails.name,
      academicRegistry: userDetails.academicRegistry,
      email: userDetails.email,
      phone: userDetails.phone,
      birthdate: userDetails.birthdate,
      genre: userDetails.genre.name,
      campus: userDetails.courseCampus.campus.name,
      course: userDetails.courseCampus.course.name,
      createdAt: userDetails.createdAt,
      updatedAt: userDetails.updatedAt,
      accessToken: accessToken,
    };

    return userToResponse;
  }
}
