import { Module } from '@nestjs/common';
import { ForumEmotionsController } from './forum-emotions.controller';
import { ForumEmotionsService } from './forum-emotions.service';

@Module({
  controllers: [ForumEmotionsController],
  providers: [ForumEmotionsService]
})
export class ForumEmotionsModule {}
