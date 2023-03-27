import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Games } from 'src/entities/games.entity';
import { Seasons } from 'src/entities/seasons.entity';
import { SeasonController } from './season.controller';
import { SeasonService } from './season.service';

@Module({
  imports:[TypeOrmModule.forFeature([Seasons,Games])],
  controllers: [SeasonController],
  providers: [SeasonService],
  exports:[SeasonService],
})
export class SeasonModule {}
