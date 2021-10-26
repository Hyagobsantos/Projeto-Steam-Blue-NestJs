import {
  Injectable,
  UnprocessableEntityException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './user.entity';
import { UserRole } from './user-roles.unum';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.senha != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return this.userRepository.createUser(createUserDto, UserRole.ADMIN);
    }
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId, {
      select: ['email', 'name', 'role', 'id'],
    });

    if (!user) {
      throw new HttpException(
        {
          message: HttpStatus.NOT_FOUND,
          erro: 'usuario não tem permissão',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    const users = await this.userRepository.findUsers(queryDto);
    return users;
  }

  async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const user = await this.findUserById(id);

    const { name, email, image, bio, role, status } = updateUserDto;

    if (name === name) {
      user.name = name;
    } else {
      user.name = user.name;
    }

    if (email === email) {
      user.email = email;
    } else {
      user.email = user.email;
    }

    if (image === image) {
      user.image = image;
    } else {
      user.image = user.image;
    }

    if (bio === bio) {
      user.bio = bio;
    } else {
      user.bio = user.bio;
    }

    if (role === role) {
      user.role = role;
    } else {
      user.role = user.role;
    }

    if (status === status) {
      user.status = status;
    } else {
      user.status = user.status;
    }

    await user.save();
    return user;
  }

  async deleteUser(userId: string) {
    const result = await this.userRepository.delete({ id: userId });

    if (result.affected === 0) {
      throw new HttpException(
        {
          message: HttpStatus.NOT_FOUND,
          erro: 'usuario não foi encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
