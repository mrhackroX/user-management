import { Test, TestingModule } from '@nestjs/testing';
import { DocumentModule } from './document.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

describe('DocumentModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DocumentModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have DocumentController', () => {
    const controller = module.get<DocumentController>(DocumentController);
    expect(controller).toBeInstanceOf(DocumentController);
  });

  it('should have DocumentService', () => {
    const service = module.get<DocumentService>(DocumentService);
    expect(service).toBeInstanceOf(DocumentService);
  });
});
