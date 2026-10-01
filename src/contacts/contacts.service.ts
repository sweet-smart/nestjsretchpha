
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema.js';
import { CreateContactDto } from './dto/create-contact.dto.js';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
    private readonly configService: ConfigService,
  ) {}

  async create(
    dto: CreateContactDto,
    ipAddress: string | null,
  ) {
    const {
      name,
      email,
      subject,
      message,
      recaptchaToken,
    } = dto;

    // 1. Get the reCAPTCHA secret key
    const secretKey = this.configService.get<string>(
      'RECAPTCHA_SECRET_KEY',
    );

    if (!secretKey) {
      throw new InternalServerErrorException(
        'reCAPTCHA is not configured',
      );
    }

    // 2. Verify the reCAPTCHA token with Google
    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', recaptchaToken);

    try {
      const response = await fetch(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        },
      );

      if (!response.ok) {
        throw new Error('reCAPTCHA service unavailable');
      }

      const verifyData = await response.json();

      if (!verifyData.success) {
        throw new BadRequestException(
          'reCAPTCHA verification failed. Please try again.',
        );
      }

      // 3. Save the contact message
      const contact = await this.contactModel.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject?.trim() || 'No subject',
        message: message.trim(),
        recaptchaScore: verifyData.score ?? null,
        ipAddress,
      });

      // 4. Return a safe response
      return {
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Server error. Please try again later.',
      );
    }
  }
}