import { User } from '../domain/user.entity';

export type UserWithoutPassword = Omit<User, 'password' | 'hashedRefreshToken'>;