import { Injectable } from '@nestjs/common';
import { ScoreRepository } from '../repositories/score-microservice.repository';
import { RpcException } from '@nestjs/microservices';
import { ScoreUserDto } from '@app/shared/dtos/score/score.dto';
import { ScoreEntity } from '@app/shared/entities/score.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ScoreMicroserviceService {
  constructor(private readonly scoreRepository: ScoreRepository) {}

  async addPointToUser(scoreDto: ScoreUserDto) {
    try {
      const { userId, score } = scoreDto;
      const numericScore = Number(score);
      if (isNaN(numericScore)) {
        throw new RpcException('امتیاز باید عدد معتبر باشد');
      }
      let userScore = await this.scoreRepository.findOne({ where: { userId } });

      if (!userScore) {
        userScore = this.scoreRepository.create({
          userId,
          score: numericScore,
        });
      } else {
        userScore.score = Number(userScore.score) + numericScore;
      }

      await this.scoreRepository.save(userScore);
      return userScore;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'unknown error';

      throw new RpcException(errorMessage);
    }
  }

  async lowerPointFromUser(userId: number, score: number) {
    try {
      let userScore = await this.scoreRepository.findOne({ where: { userId } });

      if (!userScore) {
        throw new RpcException('کاربر یافت نشد');
      }

      userScore.score -= score;
      await this.scoreRepository.save(userScore);
      console.log('User score:', userScore);
      return userScore;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'unknown error';

      throw new RpcException(errorMessage);
    }
  }

  async getScoreByUserId(userId: number): Promise<ScoreEntity[]> {
    const scoreUser = await this.scoreRepository.find({
      where: { userId: userId },
      select: {
        score: true,
        userId: true,
      },
    });

    return plainToInstance(ScoreEntity, scoreUser);
  }
}
