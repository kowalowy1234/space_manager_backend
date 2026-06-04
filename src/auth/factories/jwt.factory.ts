import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";

@Injectable()
export class JwtFactory implements JwtOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
        const jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
        
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '1h' }
        }
    }
}