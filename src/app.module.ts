import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostgresDBModule } from './db/postgresDB.module';
import { AppConfig } from './config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [AppConfig, databaseConfig]
    }),
    PostgresDBModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
