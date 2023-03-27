import { Module } from '@nestjs/common';
import { ForumMessageService } from './forum-message.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ForumMessage} from "../entities/forumMessage.entity";
import {Users} from "../entities/user.entity";
import {ForumTheme} from "../entities/forumTheme.entity";
import { ForumEmotions } from 'src/entities/forumEmotions.entity';
import { ForumMessageController } from './forum-message.controller';
import {ForumThemeLanguage} from "../entities/forumThemeLanguage";

@Module({
  imports: [TypeOrmModule.forFeature([ForumMessage, Users, ForumTheme,ForumEmotions,ForumTheme, ForumThemeLanguage])],
  controllers: [ForumMessageController],
  providers: [ForumMessageService]
})
export class ForumMessageModule {
 
}
