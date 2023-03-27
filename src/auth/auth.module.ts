import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/user.entity';
import { UserToken } from 'src/entities/usertoken.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {ShopElement} from "../entities/shopElement.entity";
import {ShopElementToUser} from "../entities/shopElementToUser.entity";


@Module({
  imports:[TypeOrmModule.forFeature([Users,UserToken, ShopElement, ShopElementToUser])],
  controllers: [AuthController],
  providers: [AuthService],
  exports:[AuthService]
})
export class AuthModule {}
