import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { ProductsService } from 'src/products/products.service';
import { StripeToken } from './providers/stripe.provider';
import { ProductStatus } from 'src/products/enums/index.enums';

@Injectable()
export class CheckoutService {
    constructor(
        @Inject(StripeToken)
        private readonly stripe: Stripe,
        private readonly productService: ProductsService
    ) {}

    async createSession(productId: number) {
        const product = await this.productService.getProduct(productId)
        if(!product) {
            throw new NotFoundException('Invalid product Id')
        }

        return this.stripe.checkout.sessions.create({
            metadata: {
                id: product.id,
                name: product.name
            },
            line_items: [
                {
                    price_data: {
                        unit_amount: product.price * 100,
                        currency: 'usd',
                        product_data: {
                            name: product.name,
                            description: product.description
                        }
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000',
            cancel_url: 'http://localhost:3000'
        })
    }

    async completeSession(event: any) {
        if(event.type !== 'checkout.session.completed') return

        const session = await this.stripe.checkout.sessions.retrieve(event.data.object.id)
        if(!session) {
            throw new HttpException('Unable to complete the session', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return await this.productService.updateProductStatus(+session.metadata?.id!, ProductStatus.SOLD)
    }
}
