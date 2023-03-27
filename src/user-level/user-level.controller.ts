import {Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import {UserLevelService} from "./user-level.service";
import {Request, Response} from "express";
import { RolesGuard } from 'src/auth/guards/role.guards';
import { UserRole } from 'src/types/userroles.type';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('user-level')
export class UserLevelController {
  constructor(private userLevel_service: UserLevelService) {
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('setUserLevelTable')
  async setUserLevelTable(@Req() req: Request, @Res() res: Response) {
    const response = await this.userLevel_service.setUserLevelTable();

    res.json({
      response
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('getLevels')
  async getLevels(@Req() req: Request, @Res() res: Response) {
    const response = await this.userLevel_service.getLevels();

    res.json({
      response
    });
  }
}
