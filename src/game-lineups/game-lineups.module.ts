import { Module } from '@nestjs/common';
import { GameLineupsController } from './game-lineups.controller';
import { GameLineupsService } from './game-lineups.service';

@Module({
  controllers: [GameLineupsController],
  providers: [GameLineupsService]
})
export class GameLineupsModule {}
