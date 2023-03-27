import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Games} from 'src/entities/games.entity';
import {Players} from 'src/entities/players.entity';
import {Rates} from 'src/entities/rates.entity';
import {Ratings} from 'src/entities/ratings.entity';
import {Repository} from 'typeorm';

@Injectable()
export class RatingsService {

  constructor(
    @InjectRepository(Ratings) private ratings_repository: Repository<Ratings>,
  ) {}




}
