import { Bucket, GetObjectCommand, PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
    private readonly s3Client: S3Client
    private readonly bucket: string
    private readonly region: string
    constructor(private readonly configService: ConfigService) {
        const accessKeyId = this.configService.getOrThrow('AWS_ACCESS_KEY')
        const secretAccessKey = this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY')

        this.region = this.configService.getOrThrow('AWS_REGION')

        const s3Config: S3ClientConfig = {
            region: this.region
        }

        if(accessKeyId && secretAccessKey) {
            s3Config.credentials = {
                accessKeyId,
                secretAccessKey
            }
        }

        this.bucket = this.configService.getOrThrow('AWS_PRODUCT_S3_BUCKET')
        this.s3Client = new S3Client(s3Config)
    }

    async upload(file: Buffer, key: string) {
        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: file
                })
            )
        }
        catch(err) {
            throw err
        }
    }

    getS3Url(key: string) {
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`
    }

    async getPresignedUrl(key: string) {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        })

        const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 })
        return url
    }
}
