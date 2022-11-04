import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GenreService } from 'src/app/services/genre/genre.service';
import { CourseCampusService } from 'src/app/services/course-campus/course-campus.service';
import { hashSync } from 'bcrypt';
import { JwtService } from 'src/jwt/jwt.service';
import { UserToReponse } from './user.types';
import { AccessToken } from 'src/auth/auth.types';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly genreService: GenreService,
    private readonly courseCampusService: CourseCampusService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
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

    const createdUser = await this.userService.create({
      ...createUserDto,
      genre: genre,
      courseCampus: courseCampus,
      password: hashSync(createUserDto.password, 10),
    });

    const userToResponse: UserToReponse & AccessToken = {
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

  // @Get()
  // async findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.userService.findOne(id);
  // }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return this.userService.remove(id);
  // }
}
