import {Body, Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import {ForumThemeLanguageService} from "./forum-theme-language.service";
import {Request, Response} from "express";
import {addForumThemeLanguageDto} from "../dto/addForumThemeLanguage.dto";
import {setDefaultForumThemeLanguageDto} from "../dto/setDefaultForumThemeLanguage.dto";
import {editForumLanguageDto} from "../dto/editForumLanguage.dto";
import { UserRole } from 'src/types/userroles.type';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('forum-theme-language')
export class ForumThemeLanguageController {

  constructor(private forumThemeLanguage_service: ForumThemeLanguageService) {}
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/addLanguage')
  async addLanguage(@Req() req: Request, @Res() res: Response, @Body() dto: addForumThemeLanguageDto) {
    const response = await this.forumThemeLanguage_service.addLanguage(dto)

    res.json({response})
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Get('/getLanguages')
  async getLanguages(@Req() req: Request, @Res() res: Response) {
    const response = await this.forumThemeLanguage_service.getLanguages()

    res.json({response})
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/setDefaultLanguage')
  async setDefaultLanguage(@Req() req: Request, @Res() res: Response, @Body() dto: setDefaultForumThemeLanguageDto) {
    const response = await this.forumThemeLanguage_service.setDefaultLanguage(dto)

    res.json({response})
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/editForumLanguage')
  async editForumLanguage(@Req() req: Request, @Res() res: Response, @Body() dto: editForumLanguageDto) {
    const response = await this.forumThemeLanguage_service.editForumLanguage(dto)

    res.json({response})
  }
}
