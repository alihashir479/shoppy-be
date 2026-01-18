import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.entity';
import { S3Service } from 'src/s3/s3.service';
import { ProductStatus } from './enums/index.enums';
import { ProductSocketGateway } from './products.gateway';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly s3Service: S3Service,
        private readonly productSocketGateway: ProductSocketGateway
    ) {}

    async createProduct(productDto: CreateProductDto, userId: number) {
        const product = this.productRepository.create({
            name: productDto.name,
            description: productDto.description,
            price: productDto.price,
            userId
        })

        await this.productRepository.save(product)
        this.productSocketGateway.handleProductUpdated()
        return product
    }

    async getAllProducts(userId: number, status?: ProductStatus) {
        const filter: FindOptionsWhere<Product> = { userId }
        if(status === ProductStatus.AVAILABLE) filter.status = status

        const products = await this.productRepository.find(({ where: { ...filter }}))
        return await Promise.all(products.map(async (product) => ({
            ...product,
            imageUrl: product.imageUrl ? await this.s3Service.getPresignedUrl(product.id.toString()) : null
        })))
    }

    async uploadProductImage(file: Buffer, productId: string) {
        try {
            const product = await this.productRepository.findOne({ where: { id : parseInt(productId) }});
            if(!product) {
                throw new NotFoundException()
            }
            await this.s3Service.upload(file, productId)
            product.imageUrl = this.s3Service.getS3Url(productId)
            await this.productRepository.save(product)
        } catch(err) {
            console.log(err)
            throw err
        }
    }

    async getProduct(productId: number) {
        const product = await this.productRepository.findOne({ where: { id: productId }})
        if(!product) {
            throw new UnprocessableEntityException('Invalid product Id')
        }
        return {
            ...product,
            imageUrl: await this.s3Service.getPresignedUrl(product.id.toString())
        }
    }

    async updateProductStatus(productId: number, status: ProductStatus) {
        const product = await this.productRepository.findOne({ where: { id: productId }})
        if(!product) {
            throw new UnprocessableEntityException('Invalid product Id')
        }

        product.status = status
        await this.productRepository.save(product)
        this.productSocketGateway.handleProductUpdated()
        return product
    }
}
