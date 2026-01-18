import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { S3Module } from 'src/s3/s3.module';
import { ProductSocketGateway } from './products.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    S3Module,
    AuthModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductSocketGateway],
  exports: [ProductsService]
})
export class ProductsModule {}
