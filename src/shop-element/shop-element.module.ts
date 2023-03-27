import { Module } from '@nestjs/common';
import { ShopElementController } from './shop-element.controller';
import { ShopElementService } from './shop-element.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ShopElement} from "../entities/shopElement.entity";
import {ShopElementToUser} from "../entities/shopElementToUser.entity";
import {Users} from "../entities/user.entity";

@Module({
  imports:[TypeOrmModule.forFeature([ShopElement, ShopElementToUser, Users])],
  controllers: [ShopElementController],
  providers: [ShopElementService]
})
export class ShopElementModule {}
