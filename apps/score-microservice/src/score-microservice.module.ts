import { Module } from '@nestjs/common';
import { RmqModule } from '@app/shared/rmq/rmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasource } from '@app/shared/config';
import { ConfigModule } from '@nestjs/config';
import { ScoreRepository } from './repositories/score-microservice.repository';
import { ScoreMicroserviceController } from './controllers/score-microservice.controller';
import { ScoreMicroserviceService } from './services/score-microservice.service';
const repository = [ScoreRepository];
@Module({
  imports: [
    RmqModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasource.options,
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([...repository]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ScoreMicroserviceController],
  providers: [...repository, ScoreMicroserviceService],
  exports: [...repository],
})
export class ScoreMicroserviceModule {}
