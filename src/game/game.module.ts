import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Games } from 'src/entities/games.entity';
import { Players } from 'src/entities/players.entity';
import { PlayerStatus } from 'src/entities/playerStatus.entity';
import { Rates } from 'src/entities/rates.entity';
import { Ratings } from 'src/entities/ratings.entity';
import { Seasons } from 'src/entities/seasons.entity';
import { SeasonModule } from 'src/season/season.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import {GameLineups} from "../entities/gameLineups.entity";
import {Users} from "../entities/user.entity";
import {ShopElement} from "../entities/shopElement.entity";
import {UserRating} from "../entities/user-rating.entity";

@Module({
  imports:[TypeOrmModule.forFeature(
    [Seasons,Games,Ratings,Rates,Players,PlayerStatus,GameLineups, Users, ShopElement, UserRating]),SeasonModule
  ],
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {}
