import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresDBModule } from './db/postgresDB.module';
import { AppConfig } from './config';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [AppConfig, databaseConfig],
    }),
    PostgresDBModule,
    AuthModule,
    PrometheusModule.register(),
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
