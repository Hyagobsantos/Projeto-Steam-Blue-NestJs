import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Delete,
  Param,
  Get,
  Patch,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { ReturnGameDto } from './dto/return-game.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/rules.guard';
import { Role } from '../auth/role.decorator';
import { UserRole } from '../users/user-roles.unum';
import { GamesService } from './games.service';
import { GetUser } from '../auth/get-decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiBody } from '@nestjs/swagger';

@Controller('games')
@UseGuards(AuthGuard(), RolesGuard)
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Post()
  @Role(UserRole.ADMIN)
  @ApiBody({ type: CreateGameDto })
  async createGame(
    @Body(ValidationPipe) createGameDto: CreateGameDto,
  ): Promise<ReturnGameDto> {
    const game = await this.gamesService.createGame(createGameDto);
    return {
      game,
      message: 'sucesso ao cadastrar',
    };
  }

  @Get()
  async findGames() {
    return this.gamesService.findGames();
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  async findGameById(@Param('id') id: string): Promise<ReturnGameDto> {
    const game = await this.gamesService.findGameById(id);

    if (!game) {
      return {
        game,
        message: 'jogo não encontrado',
      };
    } else {
      return {
        game,
        message: 'Jogo encontrado',
      };
    }
  }

  @Patch(':id')
  @ApiBody({ type: CreateGameDto })
  async updateGame(
    @Body(ValidationPipe) updateGameDto: CreateGameDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    if (user.role != UserRole.ADMIN)
      throw new HttpException(
        {
          message: HttpStatus.UNAUTHORIZED,
          erro: 'usuario não autorizado',
        },
        HttpStatus.UNAUTHORIZED,
      );
    else {
      return this.gamesService.updateGame(updateGameDto, id);
    }
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  async deleteGame(@Param('id') id: string) {
    await this.gamesService.deleteGame(id);
    return;
  }
}
