export declare class ContactFormDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    website?: string;
    age: number;
    startDate: string;
    plan: string;
    contactMethod: string;
    interests: string[];
    satisfaction: number;
    message: string;
    acceptTerms: boolean;
}
export declare class WizardSubmissionDto {
    fullName: string;
    email: string;
    company: string;
    companySize: string;
    billingCycle: string;
    plan: string;
    confirm: boolean;
}
