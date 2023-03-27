import { Users } from "src/entities/user.entity";

export type UserType=Omit<Users,'password' | 'created_at'>;