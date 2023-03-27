import { Module } from '@nestjs/common';
import { UserRatingService } from './user-rating.service';
import { UserRatingController } from './user-rating.controller';

@Module({
  providers: [UserRatingService],
  controllers: [UserRatingController]
})
export class UserRatingModule {}
