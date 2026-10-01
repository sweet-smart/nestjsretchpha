
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100, {
    message: 'Name cannot exceed 100 characters',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, {
    message: 'Subject cannot exceed 200 characters',
  })
  subject?: string;

  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  @MaxLength(5000, {
    message: 'Message cannot exceed 5000 characters',
  })
  message: string;

  @IsString()
  @IsNotEmpty({ message: 'reCAPTCHA token is required' })
  recaptchaToken: string;
}