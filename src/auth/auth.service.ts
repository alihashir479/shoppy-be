import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService
    ) {}
    async login(user: User, response: Response) {
        const tokenPayload: TokenPayload = {
            id: user.id,
            email: user.email
        }

        const currentDate = new Date()
        const expiresIn = new Date(currentDate.getTime() + (60 * 60 * 1000))

        const token = this.jwtService.sign(tokenPayload)

        response.cookie('Authentication', token, {
            expires: expiresIn
        })

        return tokenPayload
    }

    verifyToken(jwt: string) {
        return this.jwtService.verify(jwt)
    }
}
