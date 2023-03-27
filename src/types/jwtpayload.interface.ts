import { UserRole } from "./userroles.type";

export interface AccessTokenPayload {
  userId: number;
  role: UserRole;
}

export interface RefreshTokenPayload {
  userId: number;
  tokenVersion: number;
}
