import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.entity';
import { CurrentUser } from 'src/decorators/user.decorator';
import type { TokenPayload } from 'src/auth/interfaces/token-payload.interface';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { ProductStatus } from './enums/index.enums';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productService: ProductsService
    ) {}

    @Post('')
    @UseGuards(JwtAuthGuard)
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @CurrentUser() user: TokenPayload
    ) {
        return this.productService.createProduct(createProductDto, user.id)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getProducts(
        @Query() query: { status?: ProductStatus },
        @CurrentUser() user: TokenPayload
    ) {
        return await this.productService.getAllProducts(user.id, query.status)
    }

    @Post(':productId/image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async uploadProductImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                    new FileTypeValidator({ fileType: 'image/jpg' })
                ]
            })
        ) file: Express.Multer.File,
        @Req() req: Request
    ) {
        return await this.productService.uploadProductImage(file.buffer, req.params.productId)
    }

    @Get(':productId')
    @UseGuards(JwtAuthGuard)
    async getProduct(
        @Param('productId') productId: string
    ) {
        return await this.productService.getProduct(+productId)
    }
}
