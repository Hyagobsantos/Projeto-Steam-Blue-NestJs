import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Param,
  Patch,
  ForbiddenException,
  Delete,
  Query,
  HttpException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/rules.guard';
import { Role } from '../auth/role.decorator';
import { UserRole } from './user-roles.unum';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { GetUser } from '../auth/get-decorator';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('createAdmin')
  @Role(UserRole.ADMIN)
  @ApiBody({ type: CreateUserDto })
  async createAdminUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createAdminUser(createUserDto);
    return {
      user,
      message: 'Cadastro feito com sucesso',
    };
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  async findUserById(@Param('id') id: string): Promise<ReturnUserDto> {
    const user = await this.usersService.findUserById(id);

    if (!user) {
      return {
        user,
        message: 'Usuario Não Encontrado',
      };
    } else {
      return {
        user,
        message: 'Usuario Encontrado',
      };
    }
  }

  @Get()
  @Role(UserRole.ADMIN)
  async findUsers(@Query() query: FindUsersQueryDto) {
    const founds = await this.usersService.findUsers(query);

    if (!founds) {
      return {
        founds,
        message: 'Usuario Não Encontrado',
      };
    } else {
      return {
        founds,
        message: 'Usuario Encontrado',
      };
    }
  }

  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    if (user.role != UserRole.ADMIN && user.id != id)
      throw new HttpException(
        {
          message: HttpStatus.UNAUTHORIZED,
          erro: 'Usuario sem permissão',
        },
        HttpStatus.UNAUTHORIZED,
      );
    else {
      return this.usersService.updateUser(updateUserDto, id);
    }
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return { message: 'Excluido com sucesso' };
  }
}
