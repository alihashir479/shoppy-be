import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import type { TokenPayload } from 'src/auth/interfaces/token-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Post()
    async createUser(@Body() data: CreateUserDto) {
        return await this.userService.createUser(data)
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@CurrentUser() user: TokenPayload) {
        return user
    }
}
