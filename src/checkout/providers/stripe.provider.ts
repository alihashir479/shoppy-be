import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

export const StripeToken = 'Stripe'

export const StripeProvider = {
    provide: StripeToken,
    useFactory: (configService: ConfigService) => new Stripe(configService.getOrThrow('STRIPE_SECRET_KEY')),
    inject: [ConfigService]
}
  