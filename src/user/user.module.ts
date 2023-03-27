import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Games } from 'src/entities/games.entity';
import { Rates } from 'src/entities/rates.entity';
import { Ratings } from 'src/entities/ratings.entity';
import { Seasons } from 'src/entities/seasons.entity';
import { Users } from 'src/entities/user.entity';
import { UserToken } from 'src/entities/usertoken.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {ShopElementToUser} from "../entities/shopElementToUser.entity";
import {ShopElement} from "../entities/shopElement.entity";
import {UserRating} from "../entities/user-rating.entity";

@Module({
  imports:[TypeOrmModule.forFeature([Users,UserToken,Rates,Games,Ratings,Seasons, ShopElementToUser, ShopElement, UserRating])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
