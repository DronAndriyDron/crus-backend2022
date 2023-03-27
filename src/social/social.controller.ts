import {Body, Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import {SocialService} from './social.service';
import {Request, Response} from 'express';
import {socialDto} from 'src/dto/socialDto.dto';
import { UserRole } from 'src/types/userroles.type';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guards';

@Controller('social')
export class SocialController {

  constructor(public social_service: SocialService) {
  }
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('createSocials')
  async createSocials(@Req() req: Request, @Res() res: Response, @Body() dto: socialDto) {
    const response = await this.social_service.createSocials(dto);

    res.json({
      response
    });
  }
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Get('getSocials')
  async getSocials(@Req() req: Request, @Res() res: Response) {
    const response = await this.social_service.getSocials();

    res.json({
      response
    });
  }


}
