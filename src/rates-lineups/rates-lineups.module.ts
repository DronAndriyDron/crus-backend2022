import { Module } from '@nestjs/common';
import { RatesLineupsController } from './rates-lineups.controller';
import { RatesLineupsService } from './rates-lineups.service';

@Module({
  controllers: [RatesLineupsController],
  providers: [RatesLineupsService]
})
export class RatesLineupsModule {}
