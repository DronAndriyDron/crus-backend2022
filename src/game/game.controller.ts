import {Body, Controller, Get, Param, Post, Req, Res, UseGuards} from '@nestjs/common';
import {GameService} from './game.service';
import {Request, Response} from 'express';
import {GetGamesDto} from 'src/dto/getGames.dto';
import {editPlayersStatus} from 'src/dto/editPlayersStatus.dto';
import {updateGamesBySeasonDto} from "../dto/updateGamesBySeason.dto";
import {addNextGameDto} from "../dto/addNextGame.dto";
import {addGamesStatsDto} from "../dto/addGamesStatsDto";
import {getGameByUserDto} from "../dto/getGameByUser.dto";
import {getGameByIdDto} from "../dto/getGameById.dto";
import {getLastGameDto} from "../dto/getLastGame.dto";
import {getPlayersAndStatusesDto} from "../dto/games/getPlayersAndStatuses.dto";
import { RolesGuard } from 'src/auth/guards/role.guards';
import { UserRole } from 'src/types/userroles.type';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('game')
export class GameController {

  constructor(private gameService: GameService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('getPlayersAndStatuses')
  async getPlayersAndStatuses(@Req() req: Request, @Res() res: Response, @Body() dto: getPlayersAndStatusesDto) {
    const response = await this.gameService.getPlayersAndStatuses(dto);

    res.json({
      response
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('editStatuses')
  async editStatuses(@Req() req: Request, @Body() dto: editPlayersStatus, @Res() res: Response) {
    const response = await this.gameService.editStatuses(dto);

    res.json({
      response
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/getLastGame')
  async getLastGame(@Req() req: Request, @Res() res: Response, @Body() dto: getLastGameDto) {
    const response = await this.gameService.getLastGame(dto);

    res.json({
      response
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/addGameStats')
  async addGameStats(@Req() req: Request, @Res() res: Response, @Body() dto: addGamesStatsDto) {
    const response = await this.gameService.addGameStats(dto);

    res.json({
      response
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/getGameByUser')
  async getGameByUser(@Req() req: Request, @Res() res: Response, @Body() dto: getGameByUserDto) {
    const response = await this.gameService.getGameByUser(dto);

    res.json({
      response
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/getGameById')
  async getGameById(@Req() req: Request, @Res() res: Response, @Body() dto: getGameByIdDto) {
    const response = await this.gameService.getGameById(dto);

    res.json({
      response
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('updateGamesBySeason')
  async updateGamesBySeason(@Req() req: Request, @Body() dto: updateGamesBySeasonDto, @Res() res: Response) {
    const response = await this.gameService.updateGamesBySeason(dto);

    res.json({
      response
    });

  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/addNextGame')
  async addNextGame(@Req() req: Request, @Res() res: Response, @Body() dto: addNextGameDto) {
    const response = await this.gameService.addNextGame(dto);

    res.json({
      response
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/getGames')
  async getGames(@Req() req: Request, @Res() res: Response, @Body() dto: GetGamesDto) {
    const response = await this.gameService.getGames(dto);

    res.json({
      ...response
    });
  }


  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Get('/getClubStats/:season')
  async getClubStats(@Req() req: Request, @Res() res: Response, @Param("season") season: string) {
    const response = await this.gameService.getClubStats(season);

    res.json({
      response
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Get('/getPlayerStats/:id/:season')
  async getPlayersCompare(@Req() req: Request, @Res() res: Response, @Param("id") id: number, @Param("season") season: number) {
    const response = await this.gameService.getPlayersCompare(id, season);

    res.json({
      response
    });
  }
}
