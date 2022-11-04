import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/app/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserToSave } from './user.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: UserToSave) {
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'name', 'email'],
    });
  }

  async findOne(options: FindOneOptions<UserEntity>) {
    return await this.userRepository.findOne(options);
  }

  async findOneOrFail(options: FindOneOptions<UserEntity>) {
    try {
      return await this.userRepository.findOne(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    await this.userRepository.findOneOrFail({ where: { id } });
    await this.userRepository.softDelete({ id });
  }

  async getUserDetails(id: string) {
    const user = await this.findOneOrFail({
      relations: {
        genre: true,
        courseCampus: {
          campus: true,
          course: true,
        },
      },
      where: { id },
    });

    return user;
  }
}
