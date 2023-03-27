import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserRole } from '../../types/userroles.type';

export class ChangeUserRoleDto {
  @IsNotEmpty()
  @IsEmail()
  userEmail: number;

  @IsString()
  userRole: UserRole;
}
