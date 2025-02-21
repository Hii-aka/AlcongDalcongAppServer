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

    // 성별 체크
    if (sender.gender === receiver.gender) {
      throw new BadRequestException(COUPLE_ERROR_MESSAGES.GENDER_MISMATCH);
    }

    // 이미 커플인지 체크
    const existingRequest = await this.coupleRequestRepository.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: receiver.id } },
        { sender: { id: receiver.id }, receiver: { id: senderId } }
      ]
    });

    if (existingRequest) {
      throw new BadRequestException(COUPLE_ERROR_MESSAGES.REQUEST.ALREADY_EXISTS);
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
        { coupleStatus: CoupleStatus.COUPLED }
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
}