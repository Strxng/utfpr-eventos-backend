import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CourseCampusService } from 'src/app/services/course-campus/course-campus.service';
import { hashSync } from 'bcrypt';
import { JwtService } from 'src/jwt/jwt.service';
import { UserToReponse } from './user.types';
import { AccessToken, jwtPayload } from 'src/auth/auth.types';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GenreService } from '../genre/genre.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly genreService: GenreService,
    private readonly courseCampusService: CourseCampusService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserToReponse & AccessToken> {
    const namesArray = createUserDto.name.trim().split(' ');
    if (namesArray.length < 2) {
      throw new BadRequestException(['Informe seu nome completo']);
    }

    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException(['Senhas não conferem']);
    }

    const genre = await this.genreService.findOne({
      where: { id: createUserDto.genreId },
    });
    if (!genre) {
      throw new BadRequestException(['Gênero inexistente']);
    }

    const courseCampus = await this.courseCampusService.findOne({
      relations: {
        campus: true,
        course: true,
      },
      where: {
        campus: {
          id: createUserDto.campusId,
        },
        course: {
          id: createUserDto.courseId,
        },
      },
    });

    if (!courseCampus) {
      throw new BadRequestException(['Campus ou curso inexistente']);
    }

    const existingUserEmail = await this.userService.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUserEmail) {
      throw new BadRequestException(['Email já cadastrado']);
    }

    const existingUserAcademicRegistry = await this.userService.findOne({
      where: { academicRegistry: createUserDto.academicRegistry },
    });

    if (existingUserAcademicRegistry) {
      throw new BadRequestException(['Registro acadêmico já cadastrado']);
    }

    const createdUser = await this.userService.create({
      ...createUserDto,
      genre: genre,
      courseCampus: courseCampus,
      password: hashSync(createUserDto.password, 10),
    });

    const userToResponse = {
      id: createdUser.id,
      name: createdUser.name,
      academicRegistry: createdUser.academicRegistry,
      email: createdUser.email,
      phone: createdUser.phone,
      birthdate: createdUser.birthdate,
      genre: genre.name,
      campus: courseCampus.campus.name,
      course: courseCampus.course.name,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
      accessToken: this.jwtService.createAccessToken(
        createdUser.id,
        createdUser.email,
      ),
    };

    return userToResponse;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Req() req: jwtPayload): Promise<UserToReponse> {
    const user = await this.userService.getUserDetails(req.user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      academicRegistry: user.academicRegistry,
      phone: user.phone,
      campus: user.courseCampus.campus.name,
      course: user.courseCampus.course.name,
      birthdate: user.birthdate,
      genre: user.genre.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
