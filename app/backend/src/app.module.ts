import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableState } from './table-state/table-state.entity';
import { TableStateModule } from './table-state/table-state.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [TableState],
      synchronize: true, // 개발 환경에서만 true로 설정
    }),
    TableStateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
