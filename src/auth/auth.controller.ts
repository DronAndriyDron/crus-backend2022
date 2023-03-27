import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from 'src/dto/userauth.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
const mailer = require('./MAILERUTIL/mailer')
import * as bcrypt from 'bcrypt';
import { UserRole } from '../types/userroles.type';

const mailgun = require('mailgun-js');
require('dotenv').config({ path: '.env' });



@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('/signup')
  async registerUser(
    @Req() req: Request,
    @Body() dto: RegisterUserDto,
    @Res() res: Response,
  ) {

    const data = await this.authservice.registerUser(dto);


    try{
      mailer(data)
      return res.json({ message: 'Підтвердження надіслано на вашу пошту' });
    } catch (err){
      return res.json({ message:err });
    }
  }

  @UsePipes(new ValidationPipe())
  @Get('/activateAccount/:token')
  async activateAccount(
    @Req() req: Request,
    @Param('token') token: string,
    @Res() res: Response,
  ) {
    const data = await this.authservice.activateAccount(token);

    res.render('confirm-register',{});
  }

  @UsePipes(new ValidationPipe())
  @Post('/login')
  async login(
    @Req() req: Request,
    @Body() dto: LoginUserDto,
    @Res() res: Response,
  ) {
    const data = await this.authservice.login(dto);

    res.cookie('refreshtoken', data.tokens.refreshToken, {
      maxAge: 60 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).send({
      status: 'success',
      userId: data.user.id,
      accessToken: data.tokens.accessToken,
      message: 'you successful login',
    });
  }
}
