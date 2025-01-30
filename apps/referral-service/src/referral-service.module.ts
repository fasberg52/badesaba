import { Module } from '@nestjs/common';
import { ReferralController } from './controllers/referral.controller';
import { ReferralService } from './services/referral.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasource } from '@app/shared/config';
import { ConfigModule } from '@nestjs/config';
import { ReferralRepository } from './repository/referral.repository';
const repository = [ReferralRepository];
@Module({
  imports: [
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
  controllers: [ReferralController],
  providers: [...repository, ReferralService],
  exports: [...repository, ReferralService],
})
export class ReferralServiceModule {}
