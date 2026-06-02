import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in/google')
  signInWithGoogle() {}

  @Post('sign-in')
  signIn() {}
  
  @Post('sign-up')
  signUp() {}

  @Post('refresh-token')
  refreshToken() {}
}
