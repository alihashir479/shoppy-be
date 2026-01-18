import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/users.module';
import { LocalAuthStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtAuthStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule, 
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h'
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthStrategy, LocalAuthGuard, JwtAuthGuard, JwtAuthStrategy],
  exports: [AuthService]
})
export class AuthModule {}
