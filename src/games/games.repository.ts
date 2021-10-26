import { EntityRepository, Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UserRole } from '../users/user-roles.unum';

@EntityRepository(Game)
export class GameRepository extends Repository<Game> {
  async createGame(
    createGameDto: CreateGameDto,
    role: UserRole,
  ): Promise<Game> {
    const { title, image, genre, description, releaseDate } = createGameDto;
    const game = this.create();
    game.title = title;
    game.image = image;
    game.genre = genre;
    game.description = description;
    game.releaseDate = releaseDate;

    await game.save();
    return game;
  }
}
