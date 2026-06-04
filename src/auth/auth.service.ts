import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../shared/modules/prisma/prisma.service';
import * as bcrypt from "bcryptjs";
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) return null;

        const passwordMatched = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatched) return null;

        const { passwordHash, ...userWithNoPassword} = user;
        return userWithNoPassword;
    }

    signIn(user: User) {
        const payload = { email: user.email, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, {
                expiresIn: '7d'
            })
        }
    }

    async refreshToken(refreshToken: string) {
        const payload = await this.jwtService.verifyAsync(refreshToken);

        if (payload.email && payload.sub) {
            return {
                access_token: this.jwtService.sign({ email: payload.email, sub: payload.sub })
            };
        }

        throw new UnauthorizedException('Refresh token is either invalid or expired');
    }

    async registerNewUser(data: SignUpDto) {
        const {
            email,
            password,
            name,
            surname,
            phoneNumber,
        } = data;

        try {
            const whereConditions: any[] = [
                { email }
            ];

            if (phoneNumber) {
                whereConditions.push({ phoneNumber });
            }

            const existingUser = await this.prisma.user.findFirst({
                where: { OR: whereConditions }
            });

            if (existingUser) {
                if (existingUser.email === email) {
                    throw new BadRequestException("User with that email already exists");
                } 

                throw new BadRequestException("User with that phone number already exists");
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = await this.prisma.user.create({
                data: {
                    email, 
                    name, 
                    surname, 
                    passwordHash,
                    phoneNumber: phoneNumber
                },
                omit: {
                    passwordHash: true,
                }
            });

            return newUser;

        } catch (error) {
            this.logger.error("Error creating user: ", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException("An error occured while registering a new user");
        }
    }
}
