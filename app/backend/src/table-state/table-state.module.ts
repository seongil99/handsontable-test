import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableState } from './table-state.entity';
import { TableStateService } from './table-state.service';
import { TableStateController } from './table-state.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TableState])],
  providers: [TableStateService],
  controllers: [TableStateController],
})
export class TableStateModule {} 