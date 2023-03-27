import {Body, Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {TrophyService} from "./trophy.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {editFileName, imageFileFilter} from "../utils/file-uploads.utils";
import {Request, Response} from "express";
import {addTrophyDto} from "../dto/trophy/addTrophy.dto";
import {editTrophyDto} from "../dto/trophy/editTrophy.dto";
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/userroles.type';

@Controller('trophy')
export class TrophyController {

  constructor(public trophy_service: TrophyService) {
  }

  @UseInterceptors(FileInterceptor('image',
    {
      storage: diskStorage({
        destination: './public/PlayerAvatars',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }
  ))
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/addTrophy')
  async addTrophy(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: addTrophyDto,
    @UploadedFile() file: { image: Express.Multer.File },
  ) {
    const response = await this.trophy_service.addTrophy(dto, file)

    res.json({response})
  }

  @UseInterceptors(FileInterceptor('image',
    {
      storage: diskStorage({
        destination: './public/PlayerAvatars',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }
  ))
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/editTrophy')
  async editTrophy(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: editTrophyDto,
    @UploadedFile() file: { image: Express.Multer.File },
  ) {
    const response = await this.trophy_service.editTrophy(dto, file)

    res.json({response})
  }
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Delete('/removeTrophy/:id')
  async removeTrophy(@Req() req: Request, @Res() res: Response, @Param('id') id: number) {
    const response = await this.trophy_service.removeTrophy(id)

    res.json({response})
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Get('/getTrophies/:page')
  async getTrophies(@Req() req: Request, @Res() res: Response, @Param('page') page: number) {
    const response = await this.trophy_service.getTrophies(page)

    res.json({response})
  }
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Get('/getTrophy/:id')
  async getTrophy(@Req() req: Request, @Res() res: Response, @Param('id') id: number) {
    const response = await this.trophy_service.getTrophy(id)

    res.json({response})
  }

}


