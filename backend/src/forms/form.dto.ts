import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ContactFormDto {
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  firstName!: string;

  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  lastName!: string;

  @IsEmail({}, { message: 'Enter a valid email address' })
  email!: string;

  @IsOptional()
  @Matches(/^\+?[0-9 ()-]{7,20}$/, { message: 'Enter a valid phone number' })
  phone?: string;

  @IsUrl({ require_protocol: true }, { message: 'Enter a full URL including https://' })
  @IsOptional()
  website?: string;

  @Type(() => Number)
  @IsInt()
  @Min(18, { message: 'You must be at least 18' })
  @Max(120)
  age!: number;

  @IsDateString({}, { message: 'Enter a valid date' })
  startDate!: string;

  @IsIn(['starter', 'growth', 'enterprise'], { message: 'Select a plan' })
  plan!: string;

  @IsIn(['email', 'phone', 'sms'], { message: 'Select a contact method' })
  contactMethod!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Select at least one interest' })
  @IsString({ each: true })
  interests!: string[];

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  satisfaction!: number;

  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  @MaxLength(1000)
  message!: string;

  @IsBoolean()
  acceptTerms!: boolean;
}

export class WizardSubmissionDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  company!: string;

  @IsIn(['1-10', '11-50', '51-200', '200+'])
  companySize!: string;

  @IsIn(['monthly', 'annual'])
  billingCycle!: string;

  @IsIn(['starter', 'growth', 'enterprise'])
  plan!: string;

  @IsBoolean()
  confirm!: boolean;
}
