import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in/google')
  signInWithGoogle() {}

  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  signIn(
    @Request() req
  ) {
    return req.user;
  }
  
  @Post('sign-up')
  signUp() {}

  @Post('refresh-token')
  refreshToken() {}
}
