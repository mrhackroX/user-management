/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { DataSource, Repository } from 'typeorm';
import { CreateDocumentDto } from './dto/document.dto';
import { url } from 'inspector';
// import { S3 } from 'aws-sdk';

const mockDocument = {
  id: 'uuid-123',
  name: 'Test Document',
  info: 'Some info',
  url: 'http://example.com/test.pdf',
  created_at: new Date(),
  updated_at: new Date(),
};

const createQueryRunnerMock = () => ({
  connect: jest.fn(),
  release: jest.fn(),
  manager: {
    getRepository: jest.fn(),
    save: jest.fn(),
  },
});

describe('DocumentService', () => {
  let service: DocumentService;
  let dataSourceMock: Partial<DataSource>;
  let queryRunner: any;
  let documentRepoMock: Partial<Repository<any>>;

  beforeEach(async () => {
    queryRunner = createQueryRunnerMock();

    documentRepoMock = {
      find: jest.fn().mockResolvedValue([mockDocument]),
      findOne: jest.fn().mockResolvedValue(mockDocument),
      create: jest.fn().mockReturnValue(mockDocument),
      remove: jest.fn(),
    };

    queryRunner.manager.getRepository.mockReturnValue(documentRepoMock);

    dataSourceMock = {
      createQueryRunner: jest.fn(() => queryRunner),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  describe('getAllDocuments', () => {
    it('should return all documents', async () => {
      const result = await service.getAllDocuments();
      expect(result).toEqual([mockDocument]);
      expect(documentRepoMock.find).toHaveBeenCalled();
    });
  });

  describe('getDocumentById', () => {
    it('should return a document by ID', async () => {
      const result = await service.getDocumentById('uuid-123');
      expect(result).toEqual(mockDocument);
    });

    it('should throw error if document not found', async () => {
      documentRepoMock.findOne = jest.fn().mockResolvedValue(null);
      await expect(service.getDocumentById('wrong-id')).rejects.toThrow(
        'Database error occurred while fetching document by ID.',
      );
    });
  });

  describe('createDocument', () => {
    it('should create a document', async () => {
      const dto: CreateDocumentDto = {
        name: 'Doc',
        info: 'Info',
        url: 'http://example.com/doc.pdf',
      };
      queryRunner.manager.save.mockResolvedValue(mockDocument);

      const result = await service.createDocument(dto);
      expect(result).toEqual(mockDocument);
      expect(queryRunner.manager.save).toHaveBeenCalledWith(mockDocument);
    });
  });

  describe('updateDocument', () => {
    it('should update a document', async () => {
      const dto: CreateDocumentDto = {
        name: 'Updated',
        info: 'Updated Info',
        url: 'http://example.com/updated.pdf',
      };
      queryRunner.manager.save.mockResolvedValue({ ...mockDocument, ...dto });

      const result = await service.updateDocument('uuid-123', dto);
      expect(result).toMatchObject({ name: 'Updated', info: 'Updated Info' });
    });

    it('should throw if document not found', async () => {
      documentRepoMock.findOne = jest.fn().mockResolvedValue(null);
      await expect(
        service.updateDocument('wrong-id', { name: '', info: '', url: '' }),
      ).rejects.toThrow();
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      documentRepoMock.remove = jest.fn();
      await service.deleteDocument('uuid-123');
      expect(documentRepoMock.remove).toHaveBeenCalled();
    });

    it('should throw if document not found', async () => {
      documentRepoMock.findOne = jest.fn().mockResolvedValue(null);
      await expect(service.deleteDocument('wrong-id')).rejects.toThrow();
    });
  });

  describe('upload', () => {
    it('should upload a file to S3', async () => {
      const mockS3Upload = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Location: 's3-url' }),
      });

      (service as any).s3.upload = mockS3Upload;

      const mockFile = {
        originalname: 'test.pdf',
        buffer: Buffer.from('test file'),
      } as Express.Multer.File;

      const result = await service.upload(mockFile);
      expect(result).toEqual({ Location: 's3-url' });
      expect(mockS3Upload).toHaveBeenCalled();
    });

    it('should throw on S3 upload error', async () => {
      const mockS3Upload = jest.fn().mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('S3 failed')),
      });

      (service as any).s3.upload = mockS3Upload;

      const mockFile = {
        originalname: 'test.pdf',
        buffer: Buffer.from('test file'),
      } as Express.Multer.File;

      await expect(service.upload(mockFile)).rejects.toThrow(
        'Error uploading file: S3 failed',
      );
    });
  });
});
