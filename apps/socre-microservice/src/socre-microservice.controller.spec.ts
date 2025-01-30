import { Test, TestingModule } from '@nestjs/testing';
import { SocreMicroserviceController } from './controllers/socre-microservice.controller';
import { SocreMicroserviceService } from './services/socre-microservice.service';

describe('SocreMicroserviceController', () => {
  let socreMicroserviceController: SocreMicroserviceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SocreMicroserviceController],
      providers: [SocreMicroserviceService],
    }).compile();

    socreMicroserviceController = app.get<SocreMicroserviceController>(
      SocreMicroserviceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(socreMicroserviceController.getHello()).toBe('Hello World!');
    });
  });
});
