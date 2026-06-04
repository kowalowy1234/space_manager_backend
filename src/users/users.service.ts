import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/modules/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getUserProfile(userId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                omit: { passwordHash: true }
            });

            if (!user) {
                throw new NotFoundException('User not found') 
            }

            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new InternalServerErrorException('An error occured while fetching user\'s profile');
        }
    }
}
