import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {ScheduleModule} from '@nestjs/schedule';
import {TypeOrmModule} from '@nestjs/typeorm';
import {join} from 'path';
import {ServeStaticModule} from '@nestjs/serve-static';
import {AuthMiddleware} from './auth/middlewares/auth.middlewares';
import {GameModule} from './game/game.module';
import {PlayerModule} from './player/player.module';
import {RatesModule} from './rates/rates.module';
import {RatingsModule} from './ratings/ratings.module';
import {Games} from './entities/games.entity';
import {Players} from './entities/players.entity';
import {Ratings} from './entities/ratings.entity';
import {Rates} from './entities/rates.entity';
import {Seasons} from './entities/seasons.entity';
import {UserToken} from './entities/usertoken.entity';
import {Users} from './entities/user.entity';
import {SeasonModule} from './season/season.module';
import {TaskshedulerModule} from './tasksheduler/tasksheduler.module';
import {NewsModule} from './news/news.module';
import {News} from './entities/news.entity';
import {LaLiga} from './entities/laliga.entity';
import {TableModule} from './table/table.module';
import {ForumTheme} from "./entities/forumTheme.entity";
import {ForumMessage} from "./entities/forumMessage.entity";
import {ForumThemeModule} from './forum-theme/forum-theme.module';
import {ForumEmotionsModule} from './forum-emotions/forum-emotions.module';
import {ForumEmotions} from "./entities/forumEmotions.entity";
import {ForumMessageModule} from './forum-message/forum-message.module';
import {PlayerStatus} from './entities/playerStatus.entity';
import {Social} from './entities/social.entity';
import {SocialModule} from './social/social.module';
import {RatesLineupsModule} from './rates-lineups/rates-lineups.module';
import {RatesCaptainsModule} from './rates-captains/rates-captains.module';
import {RatesCaptains} from "./entities/ratesCaptains.entity";
import {RatesLineups} from "./entities/ratesLineups.entity";
import {GameLineupsModule} from './game-lineups/game-lineups.module';
import {GameLineups} from "./entities/gameLineups.entity";
import {UserLevel} from './entities/userLevel.entity'
import { UserLevelModule } from './user-level/user-level.module';
import {PlayersForm} from "./entities/playersForm.entity";
import { NewsLanguageModule } from './news-language/news-language.module';
import { NewsContentModule } from './news-content/news-content.module';
import {NewsLanguage} from "./entities/newsLanguage.entity";
import {NewsContent} from "./entities/newsContent.entity";
import { ForumThemeLanguageModule } from './forum-theme-language/forum-theme-language.module';
import {ForumThemeLanguage} from "./entities/forumThemeLanguage";
import { ShopElementModule } from './shop-element/shop-element.module';
import {ShopElement} from "./entities/shopElement.entity";
import {ShopElementToUser} from "./entities/shopElementToUser.entity";
import { TrophyModule } from './trophy/trophy.module';
import {Trophy} from "./entities/trophy.entity";
import { UserRatingModule } from './user-rating/user-rating.module';
import {UserRating} from "./entities/user-rating.entity";

require('dotenv').config({path: '.env'})

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [
      Games,
      Players,
      Ratings,
      Rates,
      Seasons,
      UserToken,
      Users,
      News,
      LaLiga,
      ForumTheme,
      ForumMessage,
      ForumEmotions,
      PlayerStatus,
      Social,
      RatesCaptains,
      RatesLineups,
      GameLineups,
      UserLevel,
      PlayersForm,
      NewsLanguage,
      NewsContent,
      ForumThemeLanguage,
      ShopElement,
      ShopElementToUser,
      Trophy,
      UserRating
    ],
    synchronize: true,
    autoLoadEntities: true,
    keepConnectionAlive: true
  }), ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
    renderPath: '/',
    exclude: ['/api*'],
  }),
    AuthModule,
    GameModule,
    PlayerModule,
    RatesModule,
    RatingsModule,
    SeasonModule,
    UserModule,
    ScheduleModule.forRoot(),
    TaskshedulerModule,
    NewsModule,
    TableModule,
    ForumThemeModule,
    ForumThemeModule,
    ForumEmotionsModule,
    ForumEmotionsModule,
    ForumMessageModule,
    SocialModule,
    RatesLineupsModule,
    RatesCaptainsModule,
    GameLineupsModule,
    UserLevelModule,
    NewsLanguageModule,
    NewsContentModule,
    ForumThemeLanguageModule,
    ShopElementModule,
    TrophyModule,
    UserRatingModule,
  ],
  providers: [],


})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}
