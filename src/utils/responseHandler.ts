/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus } from '@nestjs/common';

export class ResponseDto {
  success: boolean;
  message: string;
  data?: any;
  errors?: any;
  headers?: any;
  statusCode?: number;
}

export class ResponseHandler {
  static success(
    message: string,
    statusCode: number,
    data: any = null,
  ): ResponseDto {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode,
      success: true,
      message,
      data,
    };
  }

  static error(
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    errors: any = null,
  ) {
    throw new HttpException(
      {
        success: false,
        message,
        errors,
      },
      statusCode,
    );
  }
}
