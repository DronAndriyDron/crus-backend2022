import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from 'src/entities/news.entity';
import { NewsEmotions } from 'src/entities/newsEmotion.entity';
import { Users } from 'src/entities/user.entity';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import {NewsContent} from "../entities/newsContent.entity";
import {NewsLanguage} from "../entities/newsLanguage.entity";

@Module({
  imports:[TypeOrmModule.forFeature(
    [
      News,
      NewsEmotions,
      Users,
      NewsContent,
      NewsLanguage
    ]
  )],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
