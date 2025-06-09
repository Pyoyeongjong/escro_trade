import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "../users/user.repository";
import { User } from "src/users/entities/user.entity";
import { ConfigService } from "@nestjs/config";

// Passport 전략의 default로 passport에 등록됨됨
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService
    ){
        super({
            secretOrKey: configService.get<string>('jwt.access_secret') ?? 'access_secret',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    // 결과가 req.user에 저장됨됨
    async validate(payload) {
        const { username } = payload;
        const user: User | null = await this.userRepository.findOne(username);

        if(!user) 
            throw new UnauthorizedException();
        
        return user;
    }
    
}