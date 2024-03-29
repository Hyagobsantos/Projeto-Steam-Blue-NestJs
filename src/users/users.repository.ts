import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user-dto';
import { UserRole } from './user-roles.unum';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CredentialsDto } from '../auth/dto/credentials.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    const { email, name, senha, data_aniversario } = createUserDto;

    const user = this.create();

    user.email = email;
    user.name = name;
    user.data_aniversario = data_aniversario;
    user.role = role;
    user.status = true;
    user.confirmacao_token = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.senha = await this.hashPassword(senha, user.salt);

    try {
      await user.save();
      delete user.senha;
      delete user.salt;
      return user;
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Endereço de email já está em uso');
      } else {
        console.log(error);
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados',
        );
      }
    }
  }

  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;
    queryDto.status = queryDto.status === undefined ? true : queryDto.status;

    const { email, name, status, role } = queryDto;
    const query = this.createQueryBuilder('user');
    query.where('user.status = :status', { status });

    if (email)
      query.andWhere('user.email ILIKE :email', { email: `%${email}%` });

    if (name) query.andWhere('user.name ILIKE :name', { name: `%${name}%` });

    if (role) query.andWhere('user.role ILIKE :role', { role });

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['user.name', 'user.email', 'user.role', 'user.status']);

    const [users, total] = await query.getManyAndCount();

    return { users, total };
  }

  async changePassword(id: string, password: string) {
    const user = await this.findOne(id);
    user.salt = await bcrypt.genSalt();
    user.senha = await this.hashPassword(password, user.salt);
    user.recuperar_token = null;
    await user.save();
  }

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
    const { email, password } = credentialsDto;

    const user = await this.findOne({ email, status: true });

    if (user && (await user.verificaSenha(password))) {
      return user;
    } else {
      return null;
    }
  }
}
