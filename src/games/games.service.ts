import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRepository } from './games.repository';
import { UserRole } from '../users/user-roles.unum';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from '../games/entities/game.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameRepository)
    private gameRepository: GameRepository,
  ) {}

  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    return this.gameRepository.createGame(createGameDto, UserRole.ADMIN);
  }

  async findGames(): Promise<Game[]> {
    return Game.find();
  }

  async findGameById(gameId: string): Promise<Game> {
    const game = await this.gameRepository.findOne(gameId, {
      select: ['title', 'genre', 'releaseDate', 'id'],
    });

    if (!game) throw new NotFoundException('Jogo não encontrado');

    return game;
  }

  async updateGame(updateGameDto: CreateGameDto, id: string): Promise<Game> {
    const game = await this.findGameById(id);
    const { title, image, description, genre, releaseDate } = updateGameDto;
    game.title = title ? title : game.title;
    game.image = image ? image : game.image;
    game.description = description ? description : game.description;
    game.genre = genre ? genre : game.genre;
    game.releaseDate = releaseDate ? releaseDate : game.releaseDate;

    await game.save();
    return game;
  }

  async deleteGame(gameId: string) {
    const result = await this.gameRepository.delete({ id: gameId });
    if (result.affected === 0) {
      throw new HttpException(
        {
          message: HttpStatus.NOT_FOUND,
          erro: 'Não encontrado jogo com id informado',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
