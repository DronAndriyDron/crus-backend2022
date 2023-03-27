import common_1, {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Games } from 'src/entities/games.entity';
import { Rates } from 'src/entities/rates.entity';
import { Ratings } from 'src/entities/ratings.entity';
import { Seasons } from 'src/entities/seasons.entity';
import { Users } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { editUserNameDto } from '../dto/editUser.name.dto';
import { changePasswordDto } from '../dto/changePassword.dto';
import * as bcrypt from 'bcrypt';
import { ShopElement } from '../entities/shopElement.entity';
import { ShopElementToUser } from '../entities/shopElementToUser.entity';
import { ChangeUserRoleDto } from 'src/dto/Users/change.userRole.dto';
import { existsSync, mkdirSync, renameSync } from 'fs';
import { UserRole } from 'src/types/userroles.type';
import { join, extname } from 'path';
import * as sharp from 'sharp';
import {
  checkIfFileAllowed,
  sharpSupportedType,
} from 'src/utils/file-uploads.utils';
import {UserRating} from "../entities/user-rating.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private user_repository: Repository<Users>,
    @InjectRepository(Ratings) private rating_repository: Repository<Ratings>,
    @InjectRepository(Games) private games_repository: Repository<Games>,
    @InjectRepository(Rates) private rates_repository: Repository<Rates>,
    @InjectRepository(Seasons) private seasons_repository: Repository<Seasons>,
    @InjectRepository(ShopElement)
    private shopElement_repository: Repository<ShopElement>,
    @InjectRepository(ShopElementToUser)
    private shopElementToUser_repository: Repository<ShopElementToUser>,
    @InjectRepository(UserRating) private userRating_repository: Repository<UserRating>,
  ) {}

  async getAllUsers() {
    const UsersList = await this.user_repository.find({
      select: ['id', 'email'],
    });

    return UsersList;
  }


  async editUserName(dto: editUserNameDto) {
    if (dto.name.length < 2)
      return {
        message: 'min name length 2',
      };

    if (dto.surname.length < 3)
      return {
        message: 'min surname length 3',
      };

    const user = await this.user_repository.findOne({
      where: {
        id: dto.userId,
      },
    });

    const loginUser = await this.user_repository.findOne({
      where: {
        login: dto.login,
      },
    });
    if (loginUser) throw new HttpException('login already used', HttpStatus.NOT_FOUND);
    if (!user) throw new HttpException('user not found ', HttpStatus.NOT_FOUND);

    user.name = dto.name;
    user.surname = dto.surname;
    user.login = dto.login

    const result = await this.user_repository.save(user);

    return {
      name: result.name,
      surname: result.surname,
    };
  }

  async getUser(id) {
    const user = await this.user_repository.findOne({
      where: { id: id },
    });

    if (!user) throw new HttpException('User not exist', HttpStatus.NOT_FOUND);

    // ShopElements
    const elementsIds = [user.playerForm, user.goalkeeperForm, user.stadium];
    const shopElements = {};
    const userElements = await this.shopElement_repository
      .createQueryBuilder('ShopElements')
      .where('ShopElements.id IN (:...ids)', { ids: elementsIds })
      .getMany();
    userElements.forEach((item) => {
      shopElements[item.type] = item.image;
    });

    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      login: user.login,
      coins: user.coins,
      experience: (user.experience * 1).toFixed(1),
      box: user.box,
      shopElements: shopElements,
    };
  }

  async changePassword(dto: changePasswordDto) {
    if (dto.actualPassword.length < 6 || dto.newPassword.length < 6)
      return {
        message: 'min password length 6',
      };

    const user = await this.user_repository.findOne({
      where: {
        id: dto.userId,
      },
    });

    const isPasswordValid = await bcrypt.compare(
      dto.actualPassword,
      user.password,
    );

    if (!isPasswordValid)
      throw new common_1.BadRequestException('Invalid password');

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(dto.newPassword, saltRounds);

    user.password = hashedPassword;

    await this.user_repository.save(user);

    return {
      message: 'user password successful changed',
    };
  }

  async changeUserRole(dto: ChangeUserRoleDto) {
    const user = await this.user_repository.findOne({
      where: { email: dto.userEmail },
    });

    if (!user) throw new HttpException('User not exist', HttpStatus.NOT_FOUND);

    const allowed_role_type = [
      UserRole.ADMIN,
      UserRole.TRANSLATOR,
      UserRole.USER,
    ];

    if (!allowed_role_type.includes(dto.userRole)) {
      throw new BadRequestException('this user role not allowed');
    }

    user.role = dto.userRole;
    const saved = await this.user_repository.save(user);

    return saved;
  }

  async store(file: Express.Multer.File, userId: number) {
    const base = 'public/usersAvatars';
    const fileName = file.filename + extname(file.originalname);
    const fileFolder = String(userId);
    const filePath = join(fileFolder, fileName);
    const diskPath = join(base, filePath);
    const user = await this.user_repository.findOne(userId);
    if (!user) {
      throw new BadRequestException('USER NOT EXIST!');
    }
    const thumbnails = {
      w_176_h_176: {
        width: 176,
        height: 176,
        fit: sharp.fit.cover,
      },
      w_0_h_320: {
        width: undefined,
        height: 320,
        fit: sharp.fit.inside,
      },
      w_400_h_0: {
        width: 400,
        height: undefined,
        fit: sharp.fit.inside,
      },
    };

    checkIfFileAllowed(file);

    for (const sizeId in thumbnails) {
      const thumbnailFolder = join(fileFolder, sizeId);
      const dir = join(base, thumbnailFolder);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }

    renameSync(join(process.cwd(), file.path), diskPath);

    user.userAvatar = fileName;

    if (sharpSupportedType(file.mimetype)) {
      for (const sizeId in thumbnails) {
        const size = thumbnails[sizeId];
        const thumbnailFolder = join(fileFolder, sizeId);
        const thumbnailPath = join(thumbnailFolder, fileName);

        await sharp(diskPath, { failOnError: true })
          .resize(size)
          .toFile(join(base, thumbnailPath));
      }
    }

    await this.user_repository.save(user);

    return {
      fileName: fileName,
      displayName: file.originalname,
    };
  }

  async getUserRatingPagination(page) {
    const users =  await this.userRating_repository.createQueryBuilder()
        .skip(page * 10)
        .take(10)
        .getMany()
    const length =  await this.userRating_repository.count()



    return {
      data: users,
      page,
      length
    }
  }
}
