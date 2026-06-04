import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy as JwtPassportStrategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtPassportStrategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    validate(payload: any): unknown {
        return { userId: payload.sub, email: payload.email };
    }
}