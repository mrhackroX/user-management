/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { ResponseHandler } from '../../utils/responseHandler';
import { HttpStatus } from '@nestjs/common';
import { CreateDocumentDto } from './dto/document.dto';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;

  const mockDocumentService = {
    createDocument: jest.fn(),
    getAllDocuments: jest.fn(),
    getDocumentById: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
    upload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [{ provide: DocumentService, useValue: mockDocumentService }],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(DocumentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDocument', () => {
    it('should create a document and return success response', async () => {
      const dto: CreateDocumentDto = {
        name: 'Doc',
        info: 'Test',
        url: 'http://example.com/doc.pdf',
      };
      mockDocumentService.createDocument.mockResolvedValue(undefined);

      const result = await controller.createDocument(dto);

      expect(service.createDocument).toHaveBeenCalledWith(dto);
      expect(result).toEqual(
        ResponseHandler.success(
          'Document created successfully',
          HttpStatus.CREATED,
          null,
        ),
      );
    });
  });

  describe('getAllDocuments', () => {
    it('should return all documents', async () => {
      const docs = [{ id: '1', title: 'Doc1' }];
      mockDocumentService.getAllDocuments.mockResolvedValue(docs);

      const result = await controller.getAllDocuments();

      expect(service.getAllDocuments).toHaveBeenCalled();
      expect(result).toEqual(
        ResponseHandler.success(
          'Documents fetched successfully',
          HttpStatus.OK,
          docs,
        ),
      );
    });
  });

  describe('getDocumentById', () => {
    it('should return a document by id', async () => {
      const doc = { id: '1', title: 'Doc1' };
      mockDocumentService.getDocumentById.mockResolvedValue(doc);

      // Simulate @Body('id') extraction
      const id = '1';
      const result = await controller.getDocumentById(id);

      expect(service.getDocumentById).toHaveBeenCalledWith(id);
      expect(result).toEqual(
        ResponseHandler.success(
          'Document fetched successfully',
          HttpStatus.OK,
          doc,
        ),
      );
    });
  });

  describe('updateDocument', () => {
    it('should update a document and return success response', async () => {
      const id = '1';
      const dto: CreateDocumentDto = {
        name: 'Updated',
        info: 'Updated content',
        url: 'http://example.com/updated.pdf',
      };
      const updatedDoc = { id, ...dto };
      mockDocumentService.updateDocument.mockResolvedValue(updatedDoc);

      const result = await controller.updateDocument(id, dto);

      expect(service.updateDocument).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(
        ResponseHandler.success(
          'Document updated successfully',
          HttpStatus.OK,
          updatedDoc,
        ),
      );
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document and return success response', async () => {
      const id = '1';
      mockDocumentService.deleteDocument.mockResolvedValue(undefined);

      const result = await controller.deleteDocument(id);

      expect(service.deleteDocument).toHaveBeenCalledWith(id);
      expect(result).toEqual(
        ResponseHandler.success(
          'Document deleted successfully',
          HttpStatus.OK,
          null,
        ),
      );
    });
  });

  describe('uploadDocument', () => {
    it('should upload a document and return success response', async () => {
      const file = { originalname: 'test.pdf' } as Express.Multer.File;
      const uploadResult = { url: 'http://example.com/test.pdf' };
      mockDocumentService.upload.mockResolvedValue(uploadResult);

      const result = await controller.uploadDocument(file);

      expect(service.upload).toHaveBeenCalledWith(file);
      expect(result).toEqual(
        ResponseHandler.success(
          'Document uploaded successfully',
          HttpStatus.CREATED,
          uploadResult,
        ),
      );
    });
  });
});
