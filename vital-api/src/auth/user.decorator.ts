import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AdminJwtUser } from './jwt-user';

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext): AdminJwtUser => {
  const req = ctx.switchToHttp().getRequest<{ user: AdminJwtUser }>();
  return req.user;
});
