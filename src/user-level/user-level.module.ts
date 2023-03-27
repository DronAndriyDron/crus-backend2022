import { Module } from '@nestjs/common';
import { UserLevelController } from './user-level.controller';
import { UserLevelService } from './user-level.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserLevel} from "../entities/userLevel.entity";

@Module({
  imports:[TypeOrmModule.forFeature([UserLevel])],
  controllers: [UserLevelController],
  providers: [UserLevelService]
})
export class UserLevelModule {}
