import {Body, Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {ShopElementService} from "./shop-element.service";
import {Request, Response} from "express";
import {addShopElementDto} from "../dto/shop-element/addShopElement.dto";
import {setShopElementDefaultDto} from "../dto/shop-element/setShopElementDefault.dto";
import {buyElementDto} from "../dto/shop-element/buyElement.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {editFileName, imageFileFilter} from "../utils/file-uploads.utils";
import {editShopElementDto} from "../dto/shop-element/editShopElement.dto";
import {getShopElementsDto} from "../dto/shop-element/getShopElements.dto";
import {getShopElementsForUserDto} from "../dto/shop-element/getShopElementsForUser.dto";
import {getUserElementsDto} from "../dto/shop-element/getUserElements.dto";
import {openUserBoxDto} from "../dto/shop-element/openUserBox.dto";
import { UserRole } from 'src/types/userroles.type';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guards';

@Controller('shop-element')
export class ShopElementController {

  constructor(public shopElement_service: ShopElementService) {
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
  @Post('/addShopElement')
  async addShopElement(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: addShopElementDto,
    @UploadedFile() file: { image: Express.Multer.File },
    ) {
    const response = await this.shopElement_service.addShopElement(dto, file)

    res.json({response})
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
  @Post('/editShopElement')
  async editShopElement(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: editShopElementDto,
    @UploadedFile() file: { image?: Express.Multer.File },
  ) {
    const response = await this.shopElement_service.editShopElement(dto, file)

    res.json({response})
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Post('/setShopElementDefault')
  async setShopElementDefault(@Req() req: Request, @Res() res: Response, @Body() dto: setShopElementDefaultDto) {
    const response = await this.shopElement_service.setShopElementDefault(dto)

    res.json({response})
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Get('/getBoxElements/:page')
  async getBoxElements(@Req() req: Request, @Res() res: Response, @Param('page') page: number) {
    const response = await this.shopElement_service.getBoxElements(page)

    res.json({response})
  }

  @Get('/getTest')
  async getTest(@Req() req: Request, @Res() res: Response) {
    const response = await this.shopElement_service.getTest()

    res.json({response})
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/getShopElements')
  async getShopElements(@Req() req: Request, @Res() res: Response, @Body() dto: getShopElementsDto) {
    const response = await this.shopElement_service.getShopElements(dto)

    res.json({response})
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/getShopElementsForUser')
  async getShopElementsForUser(@Req() req: Request, @Res() res: Response, @Body() dto: getShopElementsForUserDto) {
    const response = await this.shopElement_service.getShopElementsForUser(dto)

    res.json({response})
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/getUserElements')
  async getUserElements(@Req() req: Request, @Res() res: Response, @Body() dto: getUserElementsDto) {
    const response = await this.shopElement_service.getUserElements(dto)

    res.json({response})
  }
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/setUserElementDefault')
  async setUserElementDefault(@Req() req: Request, @Res() res: Response, @Body() dto: setShopElementDefaultDto) {
    const response = await this.shopElement_service.setUserElementDefault(dto)

    res.json({response})
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/openUserBox')
  async openUserBox(@Req() req: Request, @Res() res: Response, @Body() dto: openUserBoxDto) {
    const response = await this.shopElement_service.openUserBox(dto)

    res.json({response})
  }
  
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/buyUserBox')
  async buyUserBox(@Req() req: Request, @Res() res: Response, @Body() dto: openUserBoxDto) {
    const response = await this.shopElement_service.buyUserBox(dto)

    res.json({response})
  }


  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Get('/getShopElementById/:id')
  async getShopElementById(@Req() req: Request, @Res() res: Response, @Param('id') id: number,) {
    const response = await this.shopElement_service.getShopElementById(id)

    res.json({response})
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Delete('/removeShopElement/:id')
  async removeShopElement(@Req() req: Request, @Res() res: Response, @Param('id') id: number,) {
    const response = await this.shopElement_service.removeShopElement(id)

    res.json({response})
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  @Post('/buyElement')
  async buyElement(@Req() req: Request, @Res() res: Response, @Body() dto: buyElementDto) {
    const response = await this.shopElement_service.buyElement(dto)

    res.json({response})
  }

}
