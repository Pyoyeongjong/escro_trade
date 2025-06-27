import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import { Observable } from "rxjs";
import { getAccessToken } from "src/commom/utils/auth.utils";

@Injectable()
export class MyAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();

        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith(`Bearer `)) {
            throw new UnauthorizedException("No access token provided");
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get<string>('jwt.access_secret') ?? "access_secret",
            });
            req.user = decoded;
            return true;
        } catch (err) {
            throw new UnauthorizedException("Access Token expired or invalid");
        }
    }
}