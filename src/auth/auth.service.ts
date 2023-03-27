import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/user.entity';
import { UserToken } from 'src/entities/usertoken.entity';
import { Repository } from 'typeorm';
import { sign, verify } from 'jsonwebtoken';
import { UserType } from 'src/types/user.type';
import { UserRole } from 'src/types/userroles.type';
import { RegisterUserDto } from 'src/dto/userauth.dto';
import { ShopElement } from '../entities/shopElement.entity';
import { ShopElementToUser } from '../entities/shopElementToUser.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserToken)
        private usertokenRepositiory: Repository<UserToken>,
        @InjectRepository(Users) private users_repository: Repository<Users>,
        @InjectRepository(ShopElement)
        private shopElement_repository: Repository<ShopElement>,
        @InjectRepository(ShopElementToUser)
        private shopElementToUser_repository: Repository<ShopElementToUser>,
    ) {}
    async registerUser(dto: RegisterUserDto) {
        let user;
        const { email, password } = dto;
        const existingUser = await this.findOneByEmail(email);
        const isLoginExist = await this.findOneByLogin(dto.login)
        if (existingUser || isLoginExist) {
            throw new BadRequestException('User already exists.');
        }
        if (dto.login.length < 3) {
            throw new BadRequestException('User already exists.');
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const admins = [
            'support@cruspher.com'
        ];

        if (admins.includes(dto.email)) {
            user = await this.create({
                ...dto,
                role: UserRole.ADMIN,
                password: hashedPassword,
            });
        } else {
            user = await this.create({
                ...dto,
                role: UserRole.USER,
                password: hashedPassword,
            });
        }

        const tokens = this.generateTokenPayload(
            user.id,
            user.role,
            user.isAuthenticated,
            user.name,
        );
        await this.saveToken(user.id, tokens.refreshToken);
        await this.createDefaultUserElements(user.id)


        const message = {
            to:email,
            subject: 'Account activation link',
            html: `
                <h2>Please confirm your account</h2>
                <a href="${process.env.CLIENT_URL}/api/auth/activateAccount/${tokens.accessToken}">
                Activate accaunt</a>        `,
        }


        return message;
    }
    async activateAccount(token: string) {
        if (token) {
            verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err) {
                    throw new HttpException(
                        'Incorrect or expires token',
                        HttpStatus.NOT_FOUND,
                    );
                }
                const { userId } = decodedToken;

                const existingUser = await this.findOneById(userId);

                if (existingUser) {
                    const data = await this.users_repository.findOne(userId);
                    data.isAuthenticated = true;
                    await this.users_repository.save(data);
                } else {
                    throw new HttpException('User not exist!', HttpStatus.NOT_FOUND);
                }
            });
        } else {
            throw new HttpException('Somethnig want wrong', HttpStatus.FORBIDDEN);
        }
    }

    async createDefaultUserElements(userId) {
        const user = await this.users_repository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException(
                'Incorrect or expires token',
                HttpStatus.NOT_FOUND,
            );
        }

        // Find default elements
        const shopElementsList = await this.shopElement_repository.createQueryBuilder("ShopElement")
            .where("ShopElement.id IN (:...ids)", { ids: process.env.DEFAULT_ELEMENTS_IDS.split(',') })
            .getMany();

        const shopElements = {};
        shopElementsList.forEach((item) => {
            shopElements[item.type] = item.image;
        });

        const userElementsToUse:any = process.env.DEFAULT_USED_ELEMENTS.split(',')

        user.stadium = userElementsToUse[0] * 1;
        user.goalkeeperForm = userElementsToUse[1] * 1;
        user.playerForm = userElementsToUse[2] * 1;;

        // Create elements association
        const newUserElements = shopElementsList.map((item) => {
            const newElement = new ShopElementToUser();

            newElement.user = user;
            newElement.shopElement = item;

            return newElement;
        });

        const savedElements = await this.shopElementToUser_repository.save(
            newUserElements,
        );

        const savedUser = await this.users_repository.save(user);

        return {
            savedElements,
            savedUser,
        };
    }

    async login(dto) {
        const user = await this.findOneByEmail(dto.email);

        if (!user) {
            throw new BadRequestException('invalid credentials');
        }

        if (!(await bcrypt.compare(dto.password, user.password))) {
            throw new BadRequestException('invalid password');
        }

        if (!user.isAuthenticated) {
            throw new BadRequestException(
                'Ваш акаунт не активовану,підвердіть будьласка активацію акаунту у вашому поштовому ящику',
            );
        }

        const tokens = this.generateTokenPayload(
            user.id,
            user.role,
            user.isAuthenticated,
            user.name,
        );
        await this.saveToken(user.id, tokens.refreshToken);

        return {
            user: user,
            tokens: tokens,
        };
    }

    async findById(id: number): Promise<Users> {
        return this.users_repository.findOne(id);
    }

    async findOneByEmail(email: string): Promise<Users> {
        return await this.users_repository.findOne({
            where: { email },
        });
    }

    async findOneByLogin(login: string): Promise<Users> {
        return await this.users_repository.findOne({
            where: { login },
        });
    }

    async findOneById(id: number): Promise<UserType> {
        return await this.users_repository.findOne({
            where: { id },
        });
    }

    verifyRefreshToken(token: string) {
        try {
            const userData = verify(token, process.env.JWT_SECRET);

            return userData;
        } catch {
            return null;
        }
    }

    async create(user: RegisterUserDto): Promise<Users> {
        const newUser = await this.users_repository.create(user);
        await this.users_repository.save(newUser);

        return newUser;
    }

    async findTokenInDataBase(refreshtoken: string) {
        const token = await this.usertokenRepositiory.findOne({
            refreshtoken: refreshtoken,
        });

        return token;
    }

    async refreshToken(refreshToken: string) {
        if (!refreshToken) {
            throw new HttpException(
                'you dont authorized,please sign or sign up',
                HttpStatus.UNAUTHORIZED,
            );
        }

        const userData = this.verifyRefreshToken(refreshToken);
        const userTokenFromDb = this.findTokenInDataBase(refreshToken);

        if (!userData || !userTokenFromDb) {
            throw new HttpException(
                'you dont authorized,please sign or sign up',
                HttpStatus.UNAUTHORIZED,
            );
        }

        const user = await this.users_repository.findOne(userData.id);

        const tokens = this.generateTokenPayload(
            user.id,
            user.role,
            user.isAuthenticated,
            'затичка',
        );

        await this.saveToken(user.id, tokens.refreshToken);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            userId: user.id,
        };
    }

    generateTokenPayload(
        userId: number,
        role: UserRole,
        isVerified: boolean,
        name: string,
    ) {
        const accessToken = sign(
            { userId, role, isVerified, name },
            process.env.JWT_SECRET,
            {
                expiresIn: '10d',
            },
        );

        const refreshToken = sign(
            { userId, role, isVerified, name },
            process.env.JWT_SECRET,
            {
                expiresIn: '60d',
            },
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    async saveToken(userId: number, refreshtoken: string) {
        const user = await this.users_repository.findOne(userId);

        const tokenData = await this.usertokenRepositiory.findOne({
            users: user,
        });
        if (tokenData) {
            Object.assign(tokenData, { refreshtoken: refreshtoken });

            const tokenTable = await this.usertokenRepositiory.save(tokenData);

            return tokenTable;
        }

        const token = new UserToken();
        token.refreshtoken = refreshtoken;
        token.users = user;
        return await this.usertokenRepositiory.save(token);
    }
}