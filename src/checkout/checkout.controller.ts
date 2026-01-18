import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('checkout')
export class CheckoutController {
    constructor(private readonly checkoutService: CheckoutService) {}

    @Post('session')
    @UseGuards(JwtAuthGuard)
    async createSession(@Body() request: CreateSessionDto) {
        return this.checkoutService.createSession(request.productId)
    }

    @Post('complete')
    async completeSession(@Body() event: any) {
        return this.checkoutService.completeSession(event)
    }
}
