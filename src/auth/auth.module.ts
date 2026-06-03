import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../shared/modules/prisma/prisma.module';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
