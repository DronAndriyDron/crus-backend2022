import {Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards} from '@nestjs/common';
import {Request, Response} from "express";
import { addEmotionDto } from 'src/dto/addEmotion.dto';
import {addThemeMessageDto} from "../dto/addThemeMessage.dto";
import {ForumMessageService} from "./forum-message.service";
import {editThemeMessageDto} from "../dto/editThemeMessageDto.dto";
import {getMessagesByTheme} from 'src/dto/getMessagesByTheme.dto';
import {getMessagesByReportsDto} from "../dto/forum/getMessagesByReports.dto";
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/userroles.type';
import { RolesGuard } from 'src/auth/guards/role.guards';


@Controller('forum-message')
export class ForumMessageController {
  constructor(private forum_message_service: ForumMessageService) {}


  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/addThemeMessage')
  async addThemeMessage(@Req() req: Request, @Body() dto: addThemeMessageDto, @Res() res: Response) {
    const response = await this.forum_message_service.addThemeMessage(dto)

    res.json({
      response
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.TRANSLATOR)
  @Post('/getMessagesByReports')
  async getMessagesByReports(@Req() req: Request, @Body() dto: getMessagesByReportsDto, @Res() res: Response) {
    const response = await this.forum_message_service.getMessagesByReports(dto)

    res.json({
      response
    });
  }


  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.TRANSLATOR)
  @Post('/clearReports/:id')
  async clearReports(@Req() req: Request, @Res() res: Response,@Param('id') id: number) {
    const response = await this.forum_message_service.clearReports(id)

    res.json({
      response
    });
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('/editThemeMessage')
  async editThemeMessage(@Req() req: Request, @Body() dto: editThemeMessageDto, @Res() res: Response) {
    const response = await this.forum_message_service.editThemeMessage(dto)

    res.json({
      response
    });
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/addEmotion')
  async addEmotion(@Req() req: Request, @Body() dto:addEmotionDto, @Res() res: Response) {
    const response = await this.forum_message_service.addEmotion(dto)

    res.json({
      response
    });
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Get('/addReport/:id')
  async addReport(@Req() req: Request, @Res() res: Response, @Param('id') id: number) {
    const response = await this.forum_message_service.addReport(id)

    res.json({
      response
    });
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Get('/getMessagesByTheme/:themeId/:page/')
  async getMessagesByThemePagination(@Req() req: Request,@Param() dto:getMessagesByTheme,  @Res() res: Response) {
    const response = await this.forum_message_service.getMessagesByTheme(dto);

    res.json({
      response
    });
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.TRANSLATOR)
  @Delete('removeMessage/:id')
  async removeMessage(@Req() req: Request,@Param('id') id:string,  @Res() res: Response)
  {
    const response = await this.forum_message_service.removeMessage(id);
    res.json({
      response
    });
  }

}