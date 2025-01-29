import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    console.log('Request User:', request.user);
    const user = request.user;
    return {
      id: user.sub,
    } as UserEntity;
  },
);
