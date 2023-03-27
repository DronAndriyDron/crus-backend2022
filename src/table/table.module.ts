import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaLiga } from 'src/entities/laliga.entity';
import { TableController } from './table.controller';
import { TableService } from './table.service';

@Module({
  imports: [TypeOrmModule.forFeature([LaLiga])],
  controllers: [TableController],
  providers: [TableService]
})
export class TableModule {}
