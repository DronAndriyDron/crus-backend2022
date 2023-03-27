import {Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards} from '@nestjs/common';
import {Request, Response} from 'express'
import {ForumThemeService} from "./forum-theme.service";
import {addForumThemeDto} from "../dto/addForumTheme.dto";
import {getThemesDto} from "../dto/getThemes.dto";
import {confirmThemeDto} from 'src/dto/confirmThemeDto.dto';
import {editThemeDto} from "../dto/editTheme.dto";
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/userroles.type';

@Controller('forum-theme')
export class ForumThemeController {
  constructor(private forum_theme_service: ForumThemeService) {
  }
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/addTheme')
  async addTheme(@Req() req: Request, @Body() dto: addForumThemeDto, @Res() res: Response) {
    const response = await this.forum_theme_service.addTheme(dto)

    res.json({
      response
    });
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/getThemes')
  async getThemes(@Req() req: Request, @Body() dto: getThemesDto, @Res() res: Response) {
    const response = await this.forum_theme_service.getThemes(dto)

    res.json({
      response
    });
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Delete('remove/:id')
  async deleteTheme(@Req() req: Request, @Param('id') id: number, @Res() res: Response) {
    const response = await this.forum_theme_service.removeTheme(id);


    res.json({
      response
    });
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Patch('/editTheme')
  async editTheme(@Req() req: Request, @Body() dto: editThemeDto, @Res() res: Response) {
    const response = await this.forum_theme_service.editTheme(dto)

    res.json({
      response
    });
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/confirmTheme')
  async confirmTheme(@Req() req: Request, @Body() dto: confirmThemeDto, @Res() res: Response) {
    const response = await this.forum_theme_service.confirmTheme(dto)

    res.json({
      response
    });
  }

}