import { Controller, Get } from '@nestjs/common';
import { UserService } from '../services/user-service.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { RmqService } from '@app/shared/rmq/rmq.service';
import { KEYS_RQM } from '@app/shared/constants/keys.constant';

@Controller()
export class UserServiceController {
  constructor(
    private readonly userService: UserService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'createUser' })
  async createUser(@Payload() data: any) {
    try {
      console.log('>>>>>> Creating user:', data);
      return await this.userService.createUser(data);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: KEYS_RQM.GET_USER_BY_ID })
  async getUserById(@Payload() data: number) {
    try {
      return await this.userService.getUserById(data);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'getUserByPhone' })
  async getUserByPhone(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      console.log('Received getUserByPhone request:', data);
      const user = await this.userService.getUserByPhone(data);
      // this.rmqService.ack(context);
      console.log('Sending response for getUserByPhone:', user);
      return user;
    } catch (error) {
      console.error('Error in getUserByPhone:', error.message);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: KEYS_RQM.GET_USER_BY_REFERRAL_CODE })
  async getUserByReferralCode(@Payload() data: string) {
    try {
      return await this.userService.getUserByReferralCode(data);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
