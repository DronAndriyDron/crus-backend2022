import {
  Body,
  Controller,
  Delete,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { addNewsDto } from 'src/dto/addNewsDto.dto';
import { editFileName, imageFileFilter } from 'src/utils/file-uploads.utils';
import { NewsService } from './news.service';
import { Request, Response } from 'express';
import { addNewsEmotion } from 'src/dto/addNewsEmotions.dto';
import { getNewsDto } from '../dto/getNewsDto';
import { editNewsDto } from '../dto/editNews.dto';
import { removeNewsDto } from '../dto/removeNews.dto';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/userroles.type';
import {getOneNewsDto} from "../dto/news/getOneNews.dto";

@Controller('news')
export class NewsController {
  constructor(private news_service: NewsService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('/addNews')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/newsImages',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async addNews(
    @Req() req: Request,
    @Body() dto: addNewsDto,
    @UploadedFile() file: { image?: Express.Multer.File },
    @Res() res: Response,
  ) {
    const response = await this.news_service.addNews(dto, file);

    res.json({
      response,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post('/getNews')
  async getNews(
    @Res() res: Response,
    @Body() dto: getNewsDto,
    @Req() req: Request,
  ) {
    const response = await this.news_service.getNews(dto);

    res.json({
      response,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post('/getOneNews/')
  async getOneNews(
    @Res() res: Response,
    @Body() dto: getOneNewsDto,
    @Req() req: Request,
  ) {
    const response = await this.news_service.getOneNews(dto);

    res.json({
      response,
    });
  }


  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/getNewsAdmin/:id')
  async getNewsAdmin(@Res() res: Response, @Param('id') id: number) {
    const response = await this.news_service.getNewsAdmin(id);

    res.json({
      response,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('/removeNews')
  async deleteNews(@Res() res: Response, @Body() dto: removeNewsDto) {
    const response = await this.news_service.removeNews(dto.newsId);

    res.json({
      response,
    });
  }

  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/newsImages',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('/editNews')
  async editNews(
    @Req() req: Request,
    @Body() dto: editNewsDto,
    @UploadedFile() file: { image?: Express.Multer.File },
    @Res() res: Response,
  ) {
    const response = await this.news_service.editNews(dto, file);

    res.json({
      response,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post('/addNewsEmotion')
  async addNewsEmotion(
    @Req() req: Request,
    @Body() dto: addNewsEmotion,
    @Res() res: Response,
  ) {
    const response = await this.news_service.addEmotion(dto);

    res.json({
      response,
    });
  }
}
