import { Module } from '@nestjs/common';
import { ForumThemeController } from './forum-theme.controller';
import { ForumThemeService } from './forum-theme.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ForumTheme} from "../entities/forumTheme.entity";
import { ForumMessage } from 'src/entities/forumMessage.entity';
import { ForumEmotions } from 'src/entities/forumEmotions.entity';
import {ForumThemeLanguage} from "../entities/forumThemeLanguage";

@Module({
  imports: [TypeOrmModule.forFeature([ForumTheme,ForumMessage,ForumEmotions, ForumThemeLanguage])],
  controllers: [ForumThemeController],
  providers: [ForumThemeService],
})
export class ForumThemeModule {}
