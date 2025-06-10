import { IsEmail, IsNotEmpty, MaxLength, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  password: string;

  @IsString()
  role: string;
}
