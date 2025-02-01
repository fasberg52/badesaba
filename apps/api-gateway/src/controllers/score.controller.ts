import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { SCORE_SERVICE } from '@app/shared/constants/name-microservice';
import { User } from '@app/shared/decorators/user.decorator';
import { UserEntity } from '@app/shared/entities/user.entity';
import { Controller, Inject, Post } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { ScoreResponse } from '../responses/score/score.response';

@Controller('score')
@ApiTags('Score _ Microservice')
@ApiBearerAuth()
export class ScoreController {
  constructor(@Inject(SCORE_SERVICE) private readonly scoreClient: ClientRMQ) {}

  @Post()
  @ApiOkResponse(ScoreResponse.getApiDoc())
  async getScoreUserById(@User() user: UserEntity): Promise<ScoreResponse> {
    const userId = user.id;
    const result = await firstValueFrom(
      this.scoreClient.send({ cmd: KEYS_RQM.GET_SCORE_BY_USER_ID }, userId),
    );
    return new ScoreResponse(result);
  }
}
