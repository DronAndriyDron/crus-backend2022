import {Body, Controller, Get, Param, Patch, Post, Req, Res, UseGuards} from '@nestjs/common';
import {RatesService} from './rates.service';
import {Request, Response} from 'express';
import {addRatesDto} from 'src/dto/addRates.dto';
import {editRateDto} from "../dto/editRate.dto";
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/userroles.type';

@Controller('rates')
export class RatesController {

  constructor(private rates_service: RatesService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Get("/getRatesById/:id")
  async getRates(@Req() req: Request,@Param('id') id: number, @Res() res: Response) {
    const response = await this.rates_service.getRatesById(id);

    res.json({
      response
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post("/addRate")
  async addRates(@Req() req: Request, @Body() dto: addRatesDto, @Res() res: Response) {
    const response = await this.rates_service.addRate(dto);

    res.json({
      response
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Patch('/editRate')
  async editRates(@Req() req: Request, @Body() dto: editRateDto, @Res() res: Response) {
    const response = await this.rates_service.editRate(dto);

    res.json({
      response
    });
  }
}
