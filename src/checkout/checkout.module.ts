import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { ProductsModule } from 'src/products/products.module';
import { StripeProvider } from './providers/stripe.provider';

@Module({
  imports: [ProductsModule],
  controllers: [CheckoutController],
  providers: [CheckoutService, StripeProvider]
})
export class CheckoutModule {}
