import { UserRoleEnum } from '@app/shared/enums/role.enum';

export interface JwtPayload {
  sub: 'string';
  role: UserRoleEnum;
}
