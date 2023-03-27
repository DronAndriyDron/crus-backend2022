import { Module } from '@nestjs/common';
import { RatesCaptainsController } from './rates-captains.controller';
import { RatesCaptainsService } from './rates-captains.service';

@Module({
  controllers: [RatesCaptainsController],
  providers: [RatesCaptainsService]
})
export class RatesCaptainsModule {}
