import { Module } from '@nestjs/common';
import { TrophyController } from './trophy.controller';
import { TrophyService } from './trophy.service';
import {Trophy} from "../entities/trophy.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports:[TypeOrmModule.forFeature([Trophy])],
  controllers: [TrophyController],
  providers: [TrophyService]
})
export class TrophyModule {}
