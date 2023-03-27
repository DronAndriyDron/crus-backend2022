import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Games } from 'src/entities/games.entity';
import { Players } from 'src/entities/players.entity';
import { Rates } from 'src/entities/rates.entity';
import { Seasons } from 'src/entities/seasons.entity';
import { Users } from 'src/entities/user.entity';
import { RatesController } from './rates.controller';
import { RatesService } from './rates.service';
import {RatesCaptains} from "../entities/ratesCaptains.entity";
import {RatesLineups} from "../entities/ratesLineups.entity";

@Module({
  imports:[TypeOrmModule.forFeature([Users,Rates,Players,Games,Seasons, RatesCaptains, RatesLineups])],
  controllers: [RatesController],
  providers: [RatesService]
})
export class RatesModule {}
