import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AdminJwtUser } from './jwt-user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    const secret =
      config.get<string>('JWT_SECRET') ?? 'dev-only-change-JWT_SECRET-in-production';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: { sub?: string; username?: string; role?: string }): AdminJwtUser {
    if (payload.role !== 'admin' || !payload.username) {
      throw new UnauthorizedException();
    }
    return {
      sub: payload.sub ?? 'admin',
      username: payload.username,
      role: 'admin',
    };
  }
}
