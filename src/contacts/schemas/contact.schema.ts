
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Contact {
  @Prop({
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    type: String,
    trim: true,
    default: 'No subject',
    maxlength: [200, 'Subject cannot exceed 200 characters'],
  })
  subject: string;

  @Prop({
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [5000, 'Message cannot exceed 5000 characters'],
  })
  message: string;

  @Prop({
    type: Number,
    default: null,
  })
  recaptchaScore: number | null;

  @Prop({
    type: String,
    default: null,
  })
  ipAddress: string | null;

  createdAt: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);