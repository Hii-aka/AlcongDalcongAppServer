import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CoupleRequest } from './couple-request.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { CoupleRequestStatus } from './enums/couple-request-status.enum';
import { CoupleStatus } from './enums/couple-status.enum';
import { COUPLE_ERROR_MESSAGES } from 'src/constants/messages/couple/error.message';
import { COUPLE_SERVICE } from 'src/constants/messages/couple/service.message';
import { CreateCouleRequestDto } from './dto/create-couple-request.dto';
import { CoupleResponseDto } from './dto/couple-response.dto';
@Injectable()
export class CoupleService {
  constructor(
    @InjectRepository(CoupleRequest)
    private coupleRequestRepository: Repository<CoupleRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 커플 신청
  async createCoupleRequest(senderId: number, { receiverEmail, firstMetDate }: CreateCouleRequestDto): Promise<{ message: string }> {
    // 유효성 검사
    const [sender, receiver] = await Promise.all([
      this.userRepository.findOneBy({ id: senderId }),
      this.userRepository.findOneBy({ email: receiverEmail })
    ]);

    if (!sender || !receiver) {
      throw new NotFoundException(COUPLE_ERROR_MESSAGES.USER.NOT_FOUND);
    }

    // 보낸 사람과 받는 사람이 같은 사람인지 체크
    if (sender.id === receiver.id) {
      throw new BadRequestException(COUPLE_ERROR_MESSAGES.USER.SAME_USER);
    }

    // 커플 상태 체크
    if (sender.coupleStatus === CoupleStatus.COUPLED) {
      throw new BadRequestException(COUPLE_ERROR_MESSAGES.COUPLE_STATUS.SENDER_ALREADY_COUPLED);
    } 

    if (receiver.coupleStatus === CoupleStatus.COUPLED) {
      throw new BadRequestException(COUPLE_ERROR_MESSAGES.COUPLE_STATUS.RECEIVER_ALREADY_COUPLED);
    } 

    // 성별 체크
    if (sender.gender === receiver.gender) {
      throw new BadRequestException(COUPLE_ERROR_MESSAGES.GENDER_MISMATCH);
    }

    // 이미 커플인지 체크
    const existingRequest = await this.coupleRequestRepository.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: receiver.id } },
        { sender: { id: receiver.id }, receiver: { id: senderId } }
      ],
      order: {
        createdAt: 'DESC'
      }
    });

    // 이미 커플 신청이 진행중인지 체크
    if (existingRequest && existingRequest.status === CoupleRequestStatus.PENDING) {
      throw new BadRequestException(COUPLE_ERROR_MESSAGES.REQUEST.ALREADY_EXISTS);
    }

    // 이미 커플인지 체크
    if (existingRequest && existingRequest.status === CoupleRequestStatus.ACCEPTED) {
      throw new BadRequestException(COUPLE_ERROR_MESSAGES.COUPLE_STATUS.ALREADY_COUPLED);
    }

    // 새 요청 생성
    const request = this.coupleRequestRepository.create({
      sender,
      receiver,
      status: CoupleRequestStatus.PENDING,
      firstMetDate: new Date(firstMetDate)
    });

    try {
      await this.coupleRequestRepository.save(request);
    } catch (error) {
      throw new InternalServerErrorException(COUPLE_ERROR_MESSAGES.SERVER.INTERNAL_ERROR);
    }

    return {
      message: COUPLE_SERVICE.MESSAGES.SUCCESS.CREATE_COUPLE_REQUEST,
    };
  }

  // 커플 요청 수락/거절
  async respondToCoupleRequest(
    requestId: number, 
    receiverId: number,
    accept: boolean
  ): Promise<{ message: string }> {
    const coupleRequest = await this.coupleRequestRepository.findOne({
      where: { 
        id: requestId,
        receiver: { id: receiverId },
        status: CoupleRequestStatus.PENDING
      },
      relations: ['sender', 'receiver']
    });

    if (!coupleRequest) {
      throw new NotFoundException(COUPLE_ERROR_MESSAGES.REQUEST.NOT_FOUND);
    }

    coupleRequest.status = accept ? 
      CoupleRequestStatus.ACCEPTED : 
      CoupleRequestStatus.REJECTED;

    if (accept) {
      // 커플이 성사되면 추가 로직 수행
      // 예: 두 유저의 상태 업데이트
      await this.userRepository.update(
        { id: In([coupleRequest.sender.id, coupleRequest.receiver.id]) },
        { coupleStatus: CoupleStatus.COUPLED, coupleId: coupleRequest.id }
      );
    }

    try {
      await this.coupleRequestRepository.save(coupleRequest);
    } catch (error) {
      throw new InternalServerErrorException(COUPLE_ERROR_MESSAGES.SERVER.INTERNAL_ERROR);
    }

    return {
      message: COUPLE_SERVICE.MESSAGES.SUCCESS.RESPOND_TO_COUPLE_REQUEST,
    };
  }

  async getCoupleRequestPending(userId: number): Promise<CoupleResponseDto[]> {
    const coupleRequests = await this.coupleRequestRepository
      .createQueryBuilder('coupleRequest')
      .leftJoinAndSelect('coupleRequest.sender', 'sender')
      .leftJoinAndSelect('coupleRequest.receiver', 'receiver')
      .where('(sender.id = :userId OR receiver.id = :userId)', { userId })
      .andWhere('coupleRequest.status = :status', { 
        status: CoupleRequestStatus.PENDING 
      })
      .select([
        'coupleRequest',
        'sender.id',
        'sender.email',
        'sender.nickname',
        'receiver.id',
        'receiver.email',
        'receiver.nickname',
      ])
      .getMany();
    if (coupleRequests.length < 1) {
      throw new NotFoundException(COUPLE_ERROR_MESSAGES.REQUEST.NOT_FOUND);
    }

    return coupleRequests.map(coupleRequest => {
      return {
        id: coupleRequest.id,
        sender: {
          id: coupleRequest.sender.id,
          email: coupleRequest.sender.email,
          nickname: coupleRequest.sender.nickname || '',
        },
        receiver: {
          id: coupleRequest.receiver.id,
          email: coupleRequest.receiver.email,
          nickname: coupleRequest.receiver.nickname || '' ,
        },
        status: coupleRequest.status,
        firstMetDate: coupleRequest.firstMetDate,
        createdAt: coupleRequest.createdAt,
        updatedAt: coupleRequest.updatedAt,
      };
    });
  }

  async getCoupleAccepted(userId: number): Promise<CoupleResponseDto> {
    const couple = await this.coupleRequestRepository
      .createQueryBuilder('coupleRequest')
      .leftJoinAndSelect('coupleRequest.sender', 'sender')
      .leftJoinAndSelect('coupleRequest.receiver', 'receiver')
      .where('(sender.id = :userId OR receiver.id = :userId)', { userId })
      .andWhere('coupleRequest.status = :status', { 
        status: CoupleRequestStatus.ACCEPTED 
      })
      .select([ 
        'coupleRequest',
        'sender.id',
        'sender.email',
        'sender.nickname',
        'receiver.id',
        'receiver.email',
        'receiver.nickname',
      ])
      .getOne();

    if (!couple) {
      throw new NotFoundException(COUPLE_ERROR_MESSAGES.REQUEST.NOT_FOUND);
    }

    return {
      id: couple.id,
      sender: {
        id: couple.sender.id,
        email: couple.sender.email,
        nickname: couple.sender.nickname || '',
      },
      receiver: {
        id: couple.receiver.id,
        email: couple.receiver.email,
        nickname: couple.receiver.nickname || '',
      },
      status: couple.status,
      firstMetDate: couple.firstMetDate,
      createdAt: couple.createdAt,
      updatedAt: couple.updatedAt,
    };
  }
}