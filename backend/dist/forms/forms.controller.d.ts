import type { Response } from 'express';
import { Repository } from 'typeorm';
import { ContactFormDto, WizardSubmissionDto } from './form.dto';
import { FormSubmission } from './form-submission.entity';
interface UploadedFile {
    originalname: string;
    mimetype: string;
    size: number;
}
export declare class FormsController {
    private readonly submissions;
    constructor(submissions: Repository<FormSubmission>);
    submitContact(dto: ContactFormDto): Promise<{
        message: string;
        submissionId: string;
    }>;
    submitWizard(dto: WizardSubmissionDto): Promise<{
        message: string;
        submissionId: string;
    }>;
    upload(files: UploadedFile[]): Promise<{
        message: string;
        submissionId: string;
        files: {
            originalName: string;
            mimeType: string;
            sizeBytes: number;
        }[];
    }>;
    downloadCsv(response: Response): void;
    downloadText(response: Response): void;
    listSubmissions(): Promise<{
        id: string;
        formName: string;
        payload: Record<string, unknown>;
        createdAt: string;
    }[]>;
    getSubmission(id: string): Promise<{
        id: string;
        formName: string;
        payload: Record<string, unknown>;
        createdAt: string;
    }>;
    private save;
}
export {};
