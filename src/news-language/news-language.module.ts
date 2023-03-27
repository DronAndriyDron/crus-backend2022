import { Module } from '@nestjs/common';
import { NewsLanguageController } from './news-language.controller';
import { NewsLanguageService } from './news-language.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {NewsLanguage} from "../entities/newsLanguage.entity";

@Module({
  imports:[TypeOrmModule.forFeature([NewsLanguage])],
  controllers: [NewsLanguageController],
  providers: [NewsLanguageService]
})
export class NewsLanguageModule {}
