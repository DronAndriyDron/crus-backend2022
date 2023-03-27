import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Players } from 'src/entities/players.entity';
import { Rates } from 'src/entities/rates.entity';
import { Ratings } from 'src/entities/ratings.entity';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import {ShopElement} from "../entities/shopElement.entity";
import {Users} from "../entities/user.entity";

@Module({
  imports:[TypeOrmModule.forFeature([Players,Rates,Ratings, ShopElement, Users]),MulterModule.register({
    dest:'./public/PlayerAvatars'
  })],
  controllers: [PlayerController],
  providers: [PlayerService]
})
export class PlayerModule {}
