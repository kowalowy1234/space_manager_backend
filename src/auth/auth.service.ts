import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/modules/prisma/prisma.service';
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) return null;

        const passwordMatched = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatched) return null;

        return user;
    }
}
