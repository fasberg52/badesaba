import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Public } from '@app/shared/decorators/public.decorator';
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Public()
  @Get()
  @ApiExcludeEndpoint()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('User Service', 'http://localhost:3002/health'),
    ]);
  }
}
