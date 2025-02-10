import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller'
import * as bcryptjs from 'bcryptjs';
import { AuthService } from './auth.service';
import { ApiResponseDto } from '../../api/api.response.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PassportModule } from '@nestjs/passport';
import { AppLogFormatter } from '../../logger/log.formatter';
import { PrincipalDto } from './dto/principal.dto';





describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;


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

  const mockUserWithoutPassword = { ...mockUser, password: undefined ,hashedRefreshToken: undefined};

  beforeEach(async () => {
    mockAuthService = {
      signup: jest.fn().mockResolvedValue({
        message: '회원가입이 완료되었습니다.',
      }),
      login: jest.fn().mockResolvedValue({
        user: mockUserWithoutPassword,
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      }),
      refreshToken: jest.fn().mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      }),
    };

    // Logger 모킹
    const mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockLogger,
        },
        AppLogFormatter,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('회원가입', async () => {
    const authDto = {
      email: 'test@test.com',
      password: 'password123',
    };

    const result = await controller.signup(authDto);
    expect(result).toBeInstanceOf(ApiResponseDto);  
    expect(result.message).toBe('회원가입 성공');
    expect(result.statusCode).toBe(201);
    expect(result.data?.message).toBe('회원가입이 완료되었습니다.');
  });
  
  it('로그인', async () => {
    const authDto = {
      email: 'test@test.com',
      password: 'password123',
    };

    const result = await controller.login(authDto);
    expect(result).toBeInstanceOf(ApiResponseDto);
    expect(result.message).toBe('로그인 성공');
    expect(result.statusCode).toBe(200);
    expect(result.data?.user).toBe(mockUserWithoutPassword);
    expect(result.data?.tokens).toBeDefined();
  }); 

 
    it('토큰 갱신 성공시 새로운 토큰을 반환해야 합니다', async () => {
      // Arrange
      const principalDto: PrincipalDto = {
        id: 1,
        email: 'test@test.com',
        hashedRefreshToken: 'mock-hashed-refresh-token',
      };
      

      const expectedResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };
      
      mockAuthService.refreshToken = jest.fn().mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.refresh(principalDto);

      // Assert
      expect(result).toBeInstanceOf(ApiResponseDto);
      expect(result.message).toBe('토큰 갱신 성공');
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual(expectedResponse);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(principalDto);   
   });
});

