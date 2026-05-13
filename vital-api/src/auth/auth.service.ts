import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { timingSafeEqual } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /** Constant-time equality for secrets; lengths must match. */
  private safeEqual(a: string, b: string): boolean {
    const ba = Buffer.from(a, 'utf8');
    const bb = Buffer.from(b, 'utf8');
    if (ba.length !== bb.length) {
      return false;
    }
    return timingSafeEqual(ba, bb);
  }

  login(username: string, password: string) {
    const u = username.trim();
    const p = password;

    const primaryUser =
      this.config.get<string>('ADMIN_USERNAME') ??
      this.config.get<string>('ADMIN_EMAIL') ??
      'admin';
    const primaryPass = this.config.get<string>('ADMIN_PASSWORD') ?? 'admin';

    const backupUser =
      this.config.get<string>('BACKUP_ADMIN_USERNAME') ??
      this.config.get<string>('BACKUP_ADMIN_EMAIL') ??
      '';
    const backupPass = this.config.get<string>('BACKUP_ADMIN_PASSWORD') ?? '';

    const primaryOk = this.safeEqual(u, primaryUser) && this.safeEqual(p, primaryPass);
    const backupOk =
      backupUser.length > 0 &&
      backupPass.length > 0 &&
      this.safeEqual(u, backupUser) &&
      this.safeEqual(p, backupPass);

    if (!primaryOk && !backupOk) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: 'admin', username: u, role: 'admin' as const };
    return {
      access_token: this.jwt.sign(payload),
      username: u,
      role: 'admin' as const,
    };
  }
}
