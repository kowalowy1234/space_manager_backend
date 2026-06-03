import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../shared/modules/prisma/prisma.service';
import * as bcrypt from "bcryptjs";
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly prisma: PrismaService,
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
