import { Module } from '@nestjs/common';
import { SocreMicroserviceController } from './controllers/socre-microservice.controller';
import { SocreMicroserviceService } from './services/socre-microservice.service';
import { RmqModule } from '@app/shared/rmq/rmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasource } from '@app/shared/config';
import { ConfigModule } from '@nestjs/config';
import { ScoreRepository } from './repositories/score-microservice.repository';
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
  controllers: [SocreMicroserviceController],
  providers: [SocreMicroserviceService],
})
export class SocreMicroserviceModule {}
