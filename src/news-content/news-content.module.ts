import { Module } from '@nestjs/common';
import { NewsContentController } from './news-content.controller';
import { NewsContentService } from './news-content.service';

@Module({
  controllers: [NewsContentController],
  providers: [NewsContentService]
})
export class NewsContentModule {}
