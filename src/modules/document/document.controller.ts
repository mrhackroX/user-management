/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/document.dto';
import { ResponseHandler } from 'src/utils/responseHandler';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}
  @Post()
  async createDocument(@Body() body: CreateDocumentDto) {
    await this.documentService.createDocument(body);
    return ResponseHandler.success(
      'Document created successfully',
      HttpStatus.CREATED,
      null,
    );
  }

  @Get()
  async getAllDocuments() {
    const res = await this.documentService.getAllDocuments();
    return ResponseHandler.success(
      'Documents fetched successfully',
      HttpStatus.OK,
      res,
    );
  }

  @Get(':id')
  async getDocumentById(@Body('id') id: string) {
    const res = await this.documentService.getDocumentById(id);
    return ResponseHandler.success(
      'Document fetched successfully',
      HttpStatus.OK,
      res,
    );
  }

  @Post('update/:id')
  async updateDocument(
    @Param('id') id: string,
    @Body() body: CreateDocumentDto,
  ) {
    const res = await this.documentService.updateDocument(id, body);
    return ResponseHandler.success(
      'Document updated successfully',
      HttpStatus.OK,
      res,
    );
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string) {
    await this.documentService.deleteDocument(id);
    return ResponseHandler.success(
      'Document deleted successfully',
      HttpStatus.OK,
      null,
    );
  }

  @Post('/upload')
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    const res = await this.documentService.upload(file);
    return ResponseHandler.success(
      'Document uploaded successfully',
      HttpStatus.CREATED,
      res,
    );
  }
}
