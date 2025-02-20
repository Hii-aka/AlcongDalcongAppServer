import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { MySQLErrorCode } from '../../shared/constants';
import * as bcryptjs from 'bcryptjs';



// bcryptjs 모듈 전체를 모킹
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue('salt'),
  genSaltSync: jest.fn().mockReturnValue('salt'),
  hashSync: jest.fn().mockReturnValue('hashed-password'),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  

  const salt = bcryptjs.genSaltSync();
  const hashedPassword = bcryptjs.hashSync('password123', salt);

  const mockUser = {
    id: 1,
    loginType: 'email',
    email: 'test@test.com',
    password: hashedPassword,
    nickname: 'test',
    profileImage: null,
    hashedRefreshToken: null,
    createdAt: new Date(2025, 1, 9, 10, 0, 0),  
    updatedAt: new Date(2025, 1, 9, 10, 0, 0),
    deletedAt: null,
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue({

      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    }),
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
    update: jest.fn().mockResolvedValue({ affected: 1 }),
  };






  beforeEach(async () => {
    // 각 테스트 전에 compare 모의 함수 초기화
    (bcryptjs.compare as jest.Mock).mockReset();
    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

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
        nickname: 'test',
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

  describe('duplicate email', () => {
    it('중복된 이메일로 회원가입 시 오류가 발생해야 함', async () => {
      // Arrange
      const signUpDto = {
        email: 'test@test.com',
        password: 'password123',
        nickname: 'test',
      };
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockRejectedValue({ code: MySQLErrorCode.DUPLICATE_ENTRY });
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(authService.signup(signUpDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('로그인 성공시 토큰을 반환해야 함', async () => {
      const loginDto = {
        email: 'test@test.com',
        password: 'password123',
        nickname: 'test',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockJwtService.signAsync.mockResolvedValue('mock-jwt-token');

      const result = await authService.login(loginDto);

      expect(result).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(mockUserRepository.update).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('로그아웃 성공하면 토큰이 삭제되어야 함', async () => {
      const principalDto = {
        id: 1,
        email: 'test@test.com',
        hashedRefreshToken: 'hashed-refresh-token',   
      };

      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await authService.logout(principalDto);  

      // 토큰이 삭제되었는지 확인
      const updatedUser = await userRepository.findOne({ where: { id: principalDto.id } });
      expect(updatedUser).not.toBeNull();
      expect(updatedUser!.hashedRefreshToken).toBeNull();
      expect(result).toBeDefined();
      expect(result.message).toBe('로그아웃 성공');
      expect(mockUserRepository.update).toHaveBeenCalled();
    });
  });
  

  describe('invalid email', () => {
    it('존재하지 않는 이메일로 로그인 시 오류가 발생해야 함', async () => {
      const loginDto = {
        email: 'nonexistent@test.com',
        password: 'password123',
        nickname: 'test',
      };
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(authService.login(loginDto))
        .rejects
        .toThrow(new UnauthorizedException('존재하지 않는 이메일입니다.'));
    });
  });


  describe('invalid password', () => {
    it('비밀번호가 일치하지 않을 때 오류가 발생해야 함', async () => {
      const loginDto = {
        email: 'test@test.com',
        password: 'wrong-password',
        nickname: 'test',
      };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      // 이 특정 테스트에서만 compare가 false를 반환하도록 설정
      (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(new UnauthorizedException('비밀번호가 일치하지 않습니다.'));
    });
  });

  describe('refreshToken', () => {
    it('리프레시 토큰 갱신 성공시 토큰을 반환해야 함', async () => {
      const principalDto = {
        id: 1,
        email: 'test@test.com',
        hashedRefreshToken: 'hashed-refresh-token',
      };  

      mockJwtService.signAsync.mockResolvedValue('mock-jwt-token');


      const result = await authService.refreshToken(principalDto);
     
      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(mockJwtService.signAsync).toHaveBeenCalled();
    });
  });
});