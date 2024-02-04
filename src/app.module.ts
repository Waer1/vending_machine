import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostgresDBModule } from './db/postgresDB.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    PostgresDBModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
