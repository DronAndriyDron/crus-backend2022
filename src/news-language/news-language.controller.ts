import {Body, Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import {NewsLanguageService} from "./news-language.service";
import {Request, Response} from "express";
import {addLanguageDto} from "../dto/addLanguage.dto";
import {setDefaultLanguageDto} from "../dto/setDefaultLanguage.dto";
import {editNewsLanguageDto} from "../dto/editNewsLanguage.dto";
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/userroles.type';

@Controller('news-language')
export class NewsLanguageController {
  constructor(private newsLanguage_service: NewsLanguageService) {}


  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/addLanguage')
  async addLanguage(@Req() req: Request, @Res() res: Response, @Body() dto: addLanguageDto,) {
    const response = await this.newsLanguage_service.addLanguage(dto)

    res.json({response})
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Get('/getLanguages')
  async getLanguages(@Req() req: Request, @Res() res: Response) {
    const response = await this.newsLanguage_service.getLanguages()

    res.json({response})
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/setDefaultLanguage')
  async setDefaultLanguage(@Req() req: Request, @Res() res: Response, @Body() dto: setDefaultLanguageDto) {
    const response = await this.newsLanguage_service.setDefaultLanguage(dto)

    res.json({response})
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/editNewsLanguage')
  async editNewsLanguage(@Req() req: Request, @Res() res: Response, @Body() dto: editNewsLanguageDto) {
    const response = await this.newsLanguage_service.editNewsLanguage(dto)

    res.json({response})
  }
}
