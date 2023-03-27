import {Body, Controller, Get, Param, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {PlayerService} from './player.service';
import {diskStorage} from 'multer';
import {editFileName, imageFileFilter} from 'src/utils/file-uploads.utils';
import {Request, Response} from 'express';
import {EditPlayerDto} from 'src/dto/editPlayer.dto';
import {editIsInClubDto} from 'src/dto/editIsInClubDto.dto';
import {getPlayersDto} from "../dto/getPlayers.dto";
import {addPlayerDto} from "../dto/addPlayer.dto";
import {getPlayersInClubDto} from "../dto/players/getPlayersInClub.dto";
import { RolesGuard } from 'src/auth/guards/role.guards';
import { UserRole } from 'src/types/userroles.type';
import { Roles } from 'src/auth/decorators/roles.decorator';


@Controller('player')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/getPlayers')
  async getPlayers(@Req() req: Request, @Res() res: Response, @Body() dto: getPlayersDto) {
    const response = await this.playerService.getPlayers(dto);

    res.json({
      response
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/getPlayersInClub')
  async getPlayersIsInClub(@Res() res: Response, @Body() dto: getPlayersInClubDto) {
    const response = await this.playerService.getPlayersInClub(dto);

    res.json({
      response
    });
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
  @Patch('/editPlayer')
  async editPlayer(
    @Req() req: Request,
    @Body() dto: EditPlayerDto,
    @UploadedFile() file: { image?: Express.Multer.File },
    @Res() res: Response
  ) {
    const response = await this.playerService.editPlayer(dto, file);

    res.json({
      response
    });
  }

@UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Patch('/editIsInClub')
  async editIsInClub(@Req() req: Request, @Body() dto: editIsInClubDto, @Res() res: Response) {
    const response = await this.playerService.editIsInClub(dto);

    res.json({
      response
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Get('/getPlayerById/:id')
  async getPlayerById(@Req() req: Request, @Param('id') id: number, @Res() res: Response
  ) {
    const response = await this.playerService.getPlayerById(id)

    res.json({response})
  }


  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Get('/updatePlayers')
  async updatePlayers(@Req() req: Request, @Res() res: Response) {
    const response = await this.playerService.updatePlayers()

    res.json({response})
  }

}
