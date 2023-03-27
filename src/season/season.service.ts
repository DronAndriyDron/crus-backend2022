import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Games} from 'src/entities/games.entity';
import {Seasons} from 'src/entities/seasons.entity';
import {Repository} from 'typeorm';

@Injectable()
export class SeasonService {

  constructor(
    @InjectRepository(Seasons) public season_repository: Repository<Seasons>,
    @InjectRepository(Games) public games_repository: Repository<Games>) {
  }

  async createSeason(name: string) {
    const lowerName = name.toLowerCase()
    const isHaveSeason = await this.season_repository.findOne({where: {name: lowerName}})

    if (isHaveSeason) {
      return new HttpException('Season already exists', HttpStatus.BAD_REQUEST)
    }

    // Add Season
    const season = new Seasons();
    season.name = lowerName;

    const saved = await this.season_repository.save(season);


    return saved;
  }

  async getAllSeasons() {
    const seasonsList = await this.season_repository.find();

    return seasonsList;
  }

}
