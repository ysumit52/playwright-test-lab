import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import type { Response } from 'express';
import { Repository } from 'typeorm';

import { ContactFormDto, WizardSubmissionDto } from './form.dto';
import { FormSubmission } from './form-submission.entity';

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

interface UploadedFile {
  originalname: string;
  mimetype: string;
  size: number;
}

@Controller('forms')
export class FormsController {
  constructor(
    @InjectRepository(FormSubmission)
    private readonly submissions: Repository<FormSubmission>,
  ) {}

  @Post('contact')
  @HttpCode(201)
  async submitContact(@Body() dto: ContactFormDto) {
    if (!dto.acceptTerms) {
      throw new BadRequestException('You must accept the terms to continue');
    }

    const saved = await this.save('contact', dto as unknown as Record<string, unknown>);

    return {
      message: `Thanks ${dto.firstName}, we received your message.`,
      submissionId: saved.id,
    };
  }

  @Post('wizard')
  @HttpCode(201)
  async submitWizard(@Body() dto: WizardSubmissionDto) {
    if (!dto.confirm) {
      throw new BadRequestException('Please confirm the summary to continue');
    }

    const saved = await this.save('wizard', dto as unknown as Record<string, unknown>);

    return {
      message: `Account created for ${dto.company} on the ${dto.plan} plan.`,
      submissionId: saved.id,
    };
  }

  @Post('upload')
  @HttpCode(201)
  @UseInterceptors(
    FilesInterceptor('files', 5, { limits: { fileSize: MAX_UPLOAD_BYTES } }),
  )
  async upload(@UploadedFiles() files: UploadedFile[]) {
    if (!files?.length) {
      throw new BadRequestException('Select at least one file to upload');
    }

    const uploaded = files.map((file) => ({
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    }));

    const saved = await this.save('upload', { files: uploaded });

    return {
      message: `Uploaded ${uploaded.length} file(s)`,
      submissionId: saved.id,
      files: uploaded,
    };
  }

  @Get('download/report.csv')
  downloadCsv(@Res() response: Response) {
    const rows = [
      'id,name,category,price,stock',
      '1,Aurora Headphones,Electronics,199.99,42',
      '2,Trailhead Backpack,Outdoors,89.50,17',
      '3,Loom Knit Sweater,Apparel,64.00,8',
    ].join('\n');

    response.setHeader('Content-Type', 'text/csv');
    response.setHeader(
      'Content-Disposition',
      'attachment; filename="report.csv"',
    );
    response.send(rows);
  }

  @Get('download/notes.txt')
  downloadText(@Res() response: Response) {
    response.setHeader('Content-Type', 'text/plain');
    response.setHeader(
      'Content-Disposition',
      'attachment; filename="notes.txt"',
    );
    response.send('Playwright Test Lab sample download.\nLine two.\nLine three.\n');
  }

  @Get('submissions')
  async listSubmissions() {
    const rows = await this.submissions.find({
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return rows.map((row) => ({
      id: row.id,
      formName: row.formName,
      payload: row.payload,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  @Get('submissions/:id')
  async getSubmission(@Param('id', ParseUUIDPipe) id: string) {
    const row = await this.submissions.findOne({ where: { id } });

    if (!row) {
      throw new BadRequestException(`Submission ${id} was not found`);
    }

    return {
      id: row.id,
      formName: row.formName,
      payload: row.payload,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private save(formName: string, payload: Record<string, unknown>) {
    return this.submissions.save(
      this.submissions.create({ formName, payload }),
    );
  }
}
