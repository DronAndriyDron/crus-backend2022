import {Controller, Get, Param, Req, Res, UseGuards} from '@nestjs/common';
import {TableService} from "./table.service";
import {Request, Response} from 'express';
import { UserRole } from 'src/types/userroles.type';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guards';

@Controller('table')
export class TableController {
  constructor(private LaLiga_Service: TableService) {

  }
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Get('/updateTable')
  async updateTable(@Req() req: Request, @Res() res:Response){

    const response = await this.LaLiga_Service.updateTable();

    res.json({response})
  }
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Get('/getLaLigaTableAll')
  async getLaLigaTableAll(@Req() req: Request, @Res() res:Response){

    const response = await this.LaLiga_Service.getLaLigaTableAll();

    res.json({response})
  }

}
