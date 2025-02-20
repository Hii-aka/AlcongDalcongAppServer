import { User } from '../user.entity';

export type UserWithoutPassword = Omit<User, 'password'>;

export type LoginServiceResponse = {
    user: UserWithoutPassword;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
};