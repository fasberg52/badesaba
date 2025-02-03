import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
