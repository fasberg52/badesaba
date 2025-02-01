import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { ScoreMicroserviceService } from '../services/score-microservice.service';
import { ScoreUserDto } from '@app/shared/dtos/score/score.dto';
import { RmqService } from '@app/shared/rmq/rmq.service';

@Controller()
export class ScoreMicroserviceController {
  private readonly logger = new Logger(ScoreMicroserviceController.name);

  constructor(
    private readonly scoreMicroserviceService: ScoreMicroserviceService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern({ cmd: KEYS_RQM.ADD_POINTS_TO_USER })
  async addPointsToUser(
    @Payload() data: ScoreUserDto,
    @Ctx() context: RmqContext,
  ) {
    await this.scoreMicroserviceService.addPointToUser(data);
    this.logger.log(`process complete for ADD_POINTS_TO_USER`);
    this.rmqService.ack(context);
  }

  @EventPattern({ cmd: KEYS_RQM.LOWER_POINTS_FROM_USER })
  async lowerPointsFromUser(
    @Payload() data: ScoreUserDto,
    @Ctx() context: RmqContext,
  ) {
    await this.scoreMicroserviceService.lowerPointFromUser(
      data.userId,
      data.score,
    );
    this.logger.log(`process complete for LOWER_POINTS_FROM_USER`);
    this.rmqService.ack(context);
  }

  @MessagePattern({ cmd: KEYS_RQM.GET_SCORE_BY_USER_ID })
  async getScoreByUserId(
    @Payload() userId: number,
    @Ctx() context: RmqContext,
  ) {
    try {
      const result =
        await this.scoreMicroserviceService.getScoreByUserId(userId);
      this.logger.log(`process complete for GET_SCORE_BY_USER_ID`);
      this.rmqService.ack(context);
      return result;
    } catch (error) {
      this.logger.error(
        `error process GET_SCORE_BY_USER_ID for user ${userId}: ${error}`,
      );
      this.rmqService.nAck(context);
      throw error;
    }
  }
}
