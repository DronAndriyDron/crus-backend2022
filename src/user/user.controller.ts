import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { editUserNameDto } from '../dto/editUser.name.dto';
import { changePasswordDto } from '../dto/changePassword.dto';
import { UserRole } from 'src/types/userroles.type';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { ChangeUserRoleDto } from 'src/dto/Users/change.userRole.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private user_service: UserService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/allUsers')
  async getAllUsers(@Res() res: Response) {
    const users = await this.user_service.getAllUsers();

    res.json({
      users,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get('getUsersRatingPagination/:page')
  async getUsersRatingPagination(
    @Req() req: Request,
    @Res() res: Response,
    @Param('page') page: number,
  ) {
    const response = await this.user_service.getUserRatingPagination(page);

    res.json({
      response,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Patch('editUserName')
  async editUserName(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: editUserNameDto,
  ) {
    const response = await this.user_service.editUserName(dto);

    res.json({
      response,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get('getUser/:id')
  async getUser(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    const response = await this.user_service.getUser(id);

    res.json({
      response,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post('changePassword')
  async changePassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: changePasswordDto,
  ) {
    const response = await this.user_service.changePassword(dto);

    res.json({
      response,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('changeUserRole')
  async changeUserRole(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: ChangeUserRoleDto,
  ) {
    const response = await this.user_service.changeUserRole(dto);

    res.json({
      response,
    });
  }

  @Post('/uploadAvatar')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseInterceptors(FileInterceptor('file', { dest: './public' }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const userId = req.user.id;

    const response = await this.user_service.store(file, userId);

    res.json({
      response,
    });
  }
}
