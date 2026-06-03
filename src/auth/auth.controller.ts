import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './dto/sign-up.dto';

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
  signUp(
    @Body() body: SignUpDto
  ) {
    return this.authService.registerNewUser(body);
  }

  @Post('refresh-token')
  refreshToken() {}
}
