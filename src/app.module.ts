import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { UserModule } from './user/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConnectionConfig } from './ormconfig';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { S3Module } from './s3/s3.module';
import { CheckoutModule } from './checkout/checkout.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production'
        return {
          pinoHttp: {
            transport: isProduction ? undefined : {
              target: 'pino-pretty',
              options: {
                singleLine: true
              }
            },
            level: isProduction ? 'info' : 'debug'
          },
        }
      },
      inject: [ConfigService]
    }),
    TypeOrmModule.forRoot(dbConnectionConfig),
    UserModule,
    AuthModule,
    ProductsModule,
    S3Module,
    CheckoutModule
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
