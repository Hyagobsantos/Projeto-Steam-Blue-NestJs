import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from 'src/users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../users/dto/create-user-dto';
import { User } from 'src/users/user.entity';
import { UserRole } from '../users/user-roles.unum';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.senha != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      const user = await this.userRepository.createUser(
        createUserDto,
        UserRole.USER,
      );

      return user;
    }
  }

  async signIn(credentialsDto: CredentialsDto) {
    const user = await this.userRepository.checkCredentials(credentialsDto);

    if (user === null) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const jwtPayload = {
      id: user.id,
    };

    const token = await this.jwtService.sign(jwtPayload);

    return { token };
  }

  async confirmEmail(confirmacao_token: string) {
    const result = await this.userRepository.update(
      { confirmacao_token },
      { confirmacao_token: null },
    );

    if (result.affected === 0){
      throw new HttpException(
        {
          message: HttpStatus.NOT_FOUND,
          erro: 'tokem invalido',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

}