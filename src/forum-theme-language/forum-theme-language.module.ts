import { Module } from '@nestjs/common';
import { ForumThemeLanguageController } from './forum-theme-language.controller';
import { ForumThemeLanguageService } from './forum-theme-language.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ForumThemeLanguage} from "../entities/forumThemeLanguage";

@Module({
  imports:[TypeOrmModule.forFeature([ForumThemeLanguage])],
  controllers: [ForumThemeLanguageController],
  providers: [ForumThemeLanguageService]
})
export class ForumThemeLanguageModule {}
