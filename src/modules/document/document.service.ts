/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateDocumentDto } from './dto/document.dto';
import { S3 } from 'aws-sdk';

@Injectable()
export class DocumentService {
  private readonly s3: S3;
  private readonly bucketName: string;
  constructor(private readonly dataSource: DataSource) {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET,
      region: process.env.AWS_REGION,
    });
    this.bucketName = process.env.AWS_BUCKET_NAME || 'user-documents';
  }

  async getAllDocuments(): Promise<any[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const documentRepository = queryRunner.manager.getRepository('Document');
      const documents = await documentRepository.find({
        select: ['id', 'name', 'info', 'created_at', 'updated_at'],
      });
      return documents;
    } catch (err) {
      console.error('Error fetching all documents:', err);
      throw new Error('Database error occurred while fetching documents.');
    } finally {
      await queryRunner.release();
    }
  }

  async getDocumentById(id: string): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const documentRepository = queryRunner.manager.getRepository('Document');
      const document = await documentRepository.findOne({
        where: { id },
        select: ['id', 'name', 'info', 'created_at', 'updated_at'],
      });
      if (!document) {
        throw new Error(`Document with ID ${id} not found.`);
      }
      return document;
    } catch (err) {
      console.error('Error fetching document by ID:', err);
      throw new Error('Database error occurred while fetching document by ID.');
    } finally {
      await queryRunner.release();
    }
  }

  async createDocument(documentData: CreateDocumentDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const documentRepository = queryRunner.manager.getRepository('Document');
      const newDocument = documentRepository.create(documentData);
      await queryRunner.manager.save(newDocument);
      return newDocument;
    } catch (err) {
      console.error('Error creating document:', err);
      throw new Error('Database error occurred while creating document.');
    } finally {
      await queryRunner.release();
    }
  }

  async updateDocument(
    id: string,
    documentData: CreateDocumentDto,
  ): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const documentRepository = queryRunner.manager.getRepository('Document');
      const document = await documentRepository.findOne({ where: { id } });
      if (!document) {
        throw new Error(`Document with ID ${id} not found.`);
      }
      Object.assign(document, documentData);
      await queryRunner.manager.save(document);
      return document;
    } catch (err) {
      console.error('Error updating document:', err);
      throw new Error('Database error occurred while updating document.');
    } finally {
      await queryRunner.release();
    }
  }

  async deleteDocument(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const documentRepository = queryRunner.manager.getRepository('Document');
      const document = await documentRepository.findOne({ where: { id } });
      if (!document) {
        throw new Error(`Document with ID ${id} not found.`);
      }
      await documentRepository.remove(document);
    } catch (err) {
      console.error('Error deleting document:', err);
      throw new Error('Database error occurred while deleting document.');
    } finally {
      await queryRunner.release();
    }
  }

  async upload(file: Express.Multer.File): Promise<any> {
    try {
      const uploadResult = await this.s3
        .upload({
          Bucket: this.bucketName,
          Key: `${Date.now()}-${file.originalname}`,
          Body: file.buffer,
          ACL: 'public-read',
        })
        .promise();

      return uploadResult;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error uploading file: ${error.message}`);
      }
      throw new Error('Error uploading file: Unknown error occurred');
    }
  }
}
