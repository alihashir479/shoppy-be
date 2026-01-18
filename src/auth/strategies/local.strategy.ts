import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserService } from "src/user/users.service";
import * as bcrypt from 'bcryptjs'

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService
    ) {
        super({
            usernameField: 'email'
        })
    }

    async validate(email: string, password: string) {
        try {
            const user = await this.userService.findOne('email', email)
            if(!user) {
                throw new UnauthorizedException()
            }

            const isValidPassword = await bcrypt.compare(password, user.password)
            if(!isValidPassword) {
                throw new UnauthorizedException()
            }

            return user
        }
        catch(_) {
            throw new UnauthorizedException('Credentials are not valid')
        }
    }
}