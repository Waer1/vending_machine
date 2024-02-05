import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresDBModule } from './db/postgresDB.module';
import { AppConfig, DatabaseConfig } from './config';
import { AuthModule } from './auth/auth.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { VendingModule } from './vending/vending.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [AppConfig, DatabaseConfig],
    }),
    PostgresDBModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    PrometheusModule.register(),
    VendingModule,
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
