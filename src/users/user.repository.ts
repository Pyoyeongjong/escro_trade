import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { AuthCredentialsDto } from "../auth/dto/auto-credential.dto";
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async createUser(authCredentialsDto: AuthCredentialsDto) {
        const { username, password } = authCredentialsDto;

        const exist_user = await this.userRepository.findOneBy({ name: username })
        if (exist_user)
            throw new ConflictException('Username already exists.');

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            name: username,
            password: hashedPassword,
            products: [],
            buy_list: [],
            replies: [],
            liked_products: [],
            transactions: [],
            trade_offers: []
        });

        try {
            return await this.userRepository.save(user);
        } catch (error) {
            throw new InternalServerErrorException("Can't create a new User")
        }
    }

    async saveUser(user: User) {
        try {
            return await this.userRepository.save(user);
        } catch (error) {
            throw new InternalServerErrorException("Can't save the user");
        }
    }

    async findOne(name: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { name },
            relations: ['products', 'products.buyer', 'buy_list', 'replies', 'liked_products', 'transactions', 'trade_offers',
                'trade_offers.product', 'products.trade_offers'
            ]
        });
        if (!user)
            throw new NotFoundException(`User with name ${name} not found`);
        return user;
    }

    async updateRefreshToken(name: string, refreshToken: string): Promise<void> {
        const user = await this.userRepository.findOneBy({ name });

        if (!user)
            throw new NotFoundException('User not found');

        user.refreshToken = refreshToken;
        await this.userRepository.save(user);
    }
}