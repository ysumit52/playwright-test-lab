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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const form_dto_1 = require("./form.dto");
const form_submission_entity_1 = require("./form-submission.entity");
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
let FormsController = class FormsController {
    submissions;
    constructor(submissions) {
        this.submissions = submissions;
    }
    async submitContact(dto) {
        if (!dto.acceptTerms) {
            throw new common_1.BadRequestException('You must accept the terms to continue');
        }
        const saved = await this.save('contact', dto);
        return {
            message: `Thanks ${dto.firstName}, we received your message.`,
            submissionId: saved.id,
        };
    }
    async submitWizard(dto) {
        if (!dto.confirm) {
            throw new common_1.BadRequestException('Please confirm the summary to continue');
        }
        const saved = await this.save('wizard', dto);
        return {
            message: `Account created for ${dto.company} on the ${dto.plan} plan.`,
            submissionId: saved.id,
        };
    }
    async upload(files) {
        if (!files?.length) {
            throw new common_1.BadRequestException('Select at least one file to upload');
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
    downloadCsv(response) {
        const rows = [
            'id,name,category,price,stock',
            '1,Aurora Headphones,Electronics,199.99,42',
            '2,Trailhead Backpack,Outdoors,89.50,17',
            '3,Loom Knit Sweater,Apparel,64.00,8',
        ].join('\n');
        response.setHeader('Content-Type', 'text/csv');
        response.setHeader('Content-Disposition', 'attachment; filename="report.csv"');
        response.send(rows);
    }
    downloadText(response) {
        response.setHeader('Content-Type', 'text/plain');
        response.setHeader('Content-Disposition', 'attachment; filename="notes.txt"');
        response.send('Playwright Test Lab sample download.\nLine two.\nLine three.\n');
    }
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
    async getSubmission(id) {
        const row = await this.submissions.findOne({ where: { id } });
        if (!row) {
            throw new common_1.BadRequestException(`Submission ${id} was not found`);
        }
        return {
            id: row.id,
            formName: row.formName,
            payload: row.payload,
            createdAt: row.createdAt.toISOString(),
        };
    }
    save(formName, payload) {
        return this.submissions.save(this.submissions.create({ formName, payload }));
    }
};
exports.FormsController = FormsController;
__decorate([
    (0, common_1.Post)('contact'),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [form_dto_1.ContactFormDto]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "submitContact", null);
__decorate([
    (0, common_1.Post)('wizard'),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [form_dto_1.WizardSubmissionDto]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "submitWizard", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.HttpCode)(201),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5, { limits: { fileSize: MAX_UPLOAD_BYTES } })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)('download/report.csv'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "downloadCsv", null);
__decorate([
    (0, common_1.Get)('download/notes.txt'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "downloadText", null);
__decorate([
    (0, common_1.Get)('submissions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "listSubmissions", null);
__decorate([
    (0, common_1.Get)('submissions/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "getSubmission", null);
exports.FormsController = FormsController = __decorate([
    (0, common_1.Controller)('forms'),
    __param(0, (0, typeorm_1.InjectRepository)(form_submission_entity_1.FormSubmission)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FormsController);
//# sourceMappingURL=forms.controller.js.map