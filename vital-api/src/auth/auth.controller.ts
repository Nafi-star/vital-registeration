import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AdminJwtUser } from './jwt-user';
import { User } from './user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  login(@Body() body: LoginDto) {
    return this.auth.login(body.username ?? '', body.password ?? '');
  }

  @Get('me')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  me(@User() user: AdminJwtUser) {
    return { username: user.username, role: user.role };
  }
}
