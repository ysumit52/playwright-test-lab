"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WizardSubmissionDto = exports.ContactFormDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ContactFormDto {
    firstName;
    lastName;
    email;
    phone;
    website;
    age;
    startDate;
    plan;
    contactMethod;
    interests;
    satisfaction;
    message;
    acceptTerms;
}
exports.ContactFormDto = ContactFormDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'First name must be at least 2 characters' }),
    __metadata("design:type", String)
], ContactFormDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Last name must be at least 2 characters' }),
    __metadata("design:type", String)
], ContactFormDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Enter a valid email address' }),
    __metadata("design:type", String)
], ContactFormDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\+?[0-9 ()-]{7,20}$/, { message: 'Enter a valid phone number' }),
    __metadata("design:type", String)
], ContactFormDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_protocol: true }, { message: 'Enter a full URL including https://' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ContactFormDto.prototype, "website", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18, { message: 'You must be at least 18' }),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], ContactFormDto.prototype, "age", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Enter a valid date' }),
    __metadata("design:type", String)
], ContactFormDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['starter', 'growth', 'enterprise'], { message: 'Select a plan' }),
    __metadata("design:type", String)
], ContactFormDto.prototype, "plan", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['email', 'phone', 'sms'], { message: 'Select a contact method' }),
    __metadata("design:type", String)
], ContactFormDto.prototype, "contactMethod", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Select at least one interest' }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ContactFormDto.prototype, "interests", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], ContactFormDto.prototype, "satisfaction", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Message is required' }),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], ContactFormDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ContactFormDto.prototype, "acceptTerms", void 0);
class WizardSubmissionDto {
    fullName;
    email;
    company;
    companySize;
    billingCycle;
    plan;
    confirm;
}
exports.WizardSubmissionDto = WizardSubmissionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], WizardSubmissionDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], WizardSubmissionDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], WizardSubmissionDto.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['1-10', '11-50', '51-200', '200+']),
    __metadata("design:type", String)
], WizardSubmissionDto.prototype, "companySize", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['monthly', 'annual']),
    __metadata("design:type", String)
], WizardSubmissionDto.prototype, "billingCycle", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['starter', 'growth', 'enterprise']),
    __metadata("design:type", String)
], WizardSubmissionDto.prototype, "plan", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], WizardSubmissionDto.prototype, "confirm", void 0);
//# sourceMappingURL=form.dto.js.map