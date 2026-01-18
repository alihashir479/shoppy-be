import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import bcrypt from 'node_modules/bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponse } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}
    async createUser(data: CreateUserDto) {
        const userExist = await this.findOne('email', data.email)
        if(userExist) {
            throw new UnprocessableEntityException('Email already exists')
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const user = this.userRepository.create({
            ...data,
            password: hashedPassword
        })

        await this.userRepository.save(user)
        return plainToInstance(UserResponse, user)
    }

    async findOne(attr: keyof User, value: any) {
        const user = await this.userRepository.findOneBy({
            [attr]: value
        })
        return user
    }
}
