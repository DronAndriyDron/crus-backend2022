import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SeasonService } from './season.service';
import { Request, Response } from 'express';
import AddSeasonDto from 'src/dto/addSeasonDto.dto';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/userroles.type';

@Controller('season')
export class SeasonController {
  constructor(private season_service: SeasonService) {}


  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/createSeason')
  async createSeason(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: AddSeasonDto,
  ) {
    const response = await this.season_service.createSeason(dto.name);

    res.json({
      response,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Get('/allSeasons')
  async getAllSeasons(@Res() res: Response) {
    const seasons = await this.season_service.getAllSeasons();

    res.json({
      seasons,
    });
  }
}
