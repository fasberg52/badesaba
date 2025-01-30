import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { ScoreMicroserviceService } from '../services/score-microservice.service';
import { ScoreUserDto } from '@app/shared/dtos/score/score.dto';

@Controller()
export class ScoreMicroserviceController {
  constructor(
    private readonly scoreMicroserviceService: ScoreMicroserviceService,
  ) {}

  @EventPattern({ cmd: KEYS_RQM.ADD_POINTS_TO_USER })
  async addPointsToUser(@Payload() data: ScoreUserDto) {
    return this.scoreMicroserviceService.addPointToUser(data);
  }

  @EventPattern({ cmd: KEYS_RQM.LOWER_POINTS_FROM_USER })
  async lowerPointsFromUser(@Payload() data: ScoreUserDto) {
    return this.scoreMicroserviceService.lowerPointFromUser(
      data.userId,
      data.score,
    );
  }
}
