import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  



  const mockUser = {
    id: 1,
    email: 'test@test.com',
    hashedRefreshToken: null,
  };

  const mockJwtService = {
    sign: jest.fn(() => 'test-token'),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'JWT_SECRET':
          return 'test-secret';
        case 'JWT_EXPIRATION_TIME':
          return '1h';
        default:
          return null;
      }
    }),
  };

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };






  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();



    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('signUp', () => {
    it('이메일과 비밀번호로 회원가입이 성공해야 함', async () => {
      // Arrange
      const signUpDto = {
        email: 'test@test.com',
        password: 'password123',
      };
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await authService.signup(signUpDto);

      // Assert
      expect(result).toEqual({
        message: '회원가입이 완료되었습니다.',
      });
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();

    });
  });
});
