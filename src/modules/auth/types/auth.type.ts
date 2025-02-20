import { User } from '../user.entity';

export type UserWithoutPassword = Omit<User, 'password' | 'hashedRefreshToken'>;

export type UserWithoutPasswordAndHashedRefreshToken = Omit<UserWithoutPassword, 'hashedRefreshToken'>;