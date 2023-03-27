import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ratings } from 'src/entities/ratings.entity';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';

@Module({
  imports:[TypeOrmModule.forFeature([Ratings]),],
  controllers: [RatingsController],
  providers: [RatingsService]
})
export class RatingsModule {}
