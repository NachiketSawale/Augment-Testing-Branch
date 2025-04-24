/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { BaseValidationService, DataServiceFlatRoot, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService, BasicsSharedNumberGenerationService, BasicsSharedProjectDocumentCategoryLookupService, BasicsSharedProjectDocumentStatusLookupService, Rubric } from '@libs/basics/shared';
import { DocumentComplete } from '../../model/document-complete.class';
import { IDocumentProjectEntity } from '../../model/entities/document-project-entity.interface';
import { PlatformConfigurationService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { isEmpty, isNil, isUndefined } from 'lodash';
import { IValidateRubcategoryHttpResponseEntity } from '../../model/interfaces/validate-rubcategory-httpresponse-entity.interface';
import { number } from 'mathjs';
import { IProjectDocumentTypeEntity } from '../../model/entities/project-document-type-entity.interface';
import { DocumentSharedDocumentTypeLookupService } from '../../lookup-services/document-project-document-type-lookup.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { IBasicsCustomizeProjectDocumentCategoryEntity } from '@libs/basics/interfaces';
import { UiCommonMessageBoxService } from '@libs/ui/common';

/**
 * document project validation service
 */

export class DocumentProjectHeaderValidationService extends BaseValidationService<IDocumentProjectEntity> {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly configService = inject(PlatformConfigurationService);
	protected readonly http = inject(HttpClient);
	private readonly genNumberSvc = inject(BasicsSharedNumberGenerationService);
	private readonly documentSharedDocumentTypeLookupService = inject(DocumentSharedDocumentTypeLookupService);
	private readonly projectDocumentStatusLookupService = inject(BasicsSharedProjectDocumentStatusLookupService);
	private readonly dialogService = inject(UiCommonMessageBoxService);

	public constructor(protected dataService: DataServiceFlatRoot<IDocumentProjectEntity, DocumentComplete>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IDocumentProjectEntity> {
		return {
			Code: this.validateCode,
			BpdSubsidiaryFk: this.validateBpdSubsidiaryFk,
			Url: this.validateUrl,
			PrjDocumentFk: this.validatePrjDocumentFk,
			BpdBusinessPartnerFk: this.validateBpdBusinessPartnerFk,
			Barcode: this.validateBarcode,
			PrjProjectFk: this.validateProject,
			PsdScheduleFk: this.validatePsdScheduleFk,
			RubricCategoryFk: [this.validateRubricCategoryFk],
			PrjDocumentTypeFk: this.validatePrjDocumentTypeFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IDocumentProjectEntity> {
		return this.dataService;
	}

	protected async validateCode(info: ValidationInfo<IDocumentProjectEntity>): Promise<ValidationResult> {
		return this.validationUtils.isSynAndAsyncUnique(info, this.dataService.getList(), 'documents/projectdocument/final/isunique');
	}

	protected async validateBpdSubsidiaryFk(info: ValidationInfo<IDocumentProjectEntity>): Promise<ValidationResult> {
		if (isEmpty(info.value)) {
			info.entity.BpdSubsidiaryFk = null;
			info.entity.BpdContactFk = null;
		}
		if (info.entity.BpdSubsidiaryFk !== info.value) {
			//todo we need use common validationBP
		}
		return new ValidationResult();
	}

	private isMandatoryValidation(info: ValidationInfo<IDocumentProjectEntity>) {
		const result = this.validationUtils.isMandatory(info);
		return result;
	}

	protected validateUrl(info: ValidationInfo<IDocumentProjectEntity>): ValidationResult {
		if (isNil(info.value) || isUndefined(info.value) || isEmpty(info.value)) {
			return new ValidationResult();
		}

		const strValue = info.value as string;
		let reg: RegExp | undefined;

		if (strValue.startsWith('www.')) {
			reg = new RegExp('(^|\\s)((https?://)?[\\w-]+(\\.[\\w-]+)+\\.?(:\\d+)?(/\\S*)?)');
		} else if (['http', 'https', 'ftp', 'ftps', 'file'].some((word) => strValue.startsWith(word))) {
			reg = new RegExp('^((http[s]?|ftp[s]?|file):\\/\\/)?\\/?((\\/\\w+)*\\/)([\\w\\-\\.]+[^#?\\s]+)(.*)?(#[\\w\\-]+)?$', 'i');
		} else if (strValue.startsWith('\\')) {
			reg = new RegExp('((\\w+)*)([\\w]+[^#?\\s]+)(.*)?(#[\\w]+)?');
		} else if (strValue.length < 50) {
			reg = new RegExp('^[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$');
		}

		return new ValidationResult(reg && reg.test(strValue) ? undefined : 'platform.errorMessage.url');
	}

	protected validatePrjDocumentFk(info: ValidationInfo<IDocumentProjectEntity>): ValidationResult {
		return isNil(info.value) ? new ValidationResult('cloud.common.emptyOrNullValueErrorMessage') : new ValidationResult();
	}

	protected async validateBpdBusinessPartnerFk(info: ValidationInfo<IDocumentProjectEntity>): Promise<ValidationResult> {
		//todo we need use common validationBP
		return new ValidationResult();
	}

	private isMandatory(info: ValidationInfo<IDocumentProjectEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}

	private applyValidationResult(result: ValidationResult, entity: IDocumentProjectEntity, field: string) {
		if (result.valid) {
			this.dataService.removeInvalid(entity, { result: result, field: field });
		} else {
			this.dataService.addInvalid(entity, { result: result, field: field });
		}
	}

	private validateBarcode(info: ValidationInfo<IDocumentProjectEntity>): ValidationResult {
		return this.validationUtils.createSuccessObject();
	}

	private validateProject(info: ValidationInfo<IDocumentProjectEntity>): ValidationResult {
		return new ValidationResult();
	}

	private validatePsdScheduleFk(info: ValidationInfo<IDocumentProjectEntity>): ValidationResult {
		return new ValidationResult();
	}

	private async validateRubricCategoryFk(info: ValidationInfo<IDocumentProjectEntity>): Promise<ValidationResult> {
		const result = new ValidationResult();
		if (isNil(info.value) || isUndefined(info.value)) {
			return result;
		}
		const docStatuses = await firstValueFrom(this.projectDocumentStatusLookupService.getList());
		if (docStatuses.length > 0) {
			const defaultStatus = docStatuses.find((o) => o.RubricCategoryFk === info.value && o.IsDefault);
			if (!isNil(defaultStatus)) {
				info.entity.PrjDocumentStatusFk = defaultStatus.Id;
			} else {
				await this.dialogService.showMsgBox(this.translate.instant('documents.project.rubricCategoryMissingDefautStatus').text, this.translate.instant('documents.project.FileUpload.validation.NoDefaultStatus').text, 'ico-waring');
			}
			const hasToGenerateCode = this.genNumberSvc.hasNumberGenerateConfig(number(info.value.toString()));
			if (hasToGenerateCode) {
				info.entity.Code = this.genNumberSvc.provideNumberDefaultText(number(info.value.toString()), Rubric.Documents);
			} else {
				if (info.entity.Version === 0) {
					info.entity.Code = '';
				}
			}
		}
		return result;
	}

	public async validateRubricCategoryFkFromWizard(info: ValidationInfo<IDocumentProjectEntity>) {
		return this.setRubricCategoryFk(info);
	}

	private async setRubricCategoryFk(info: ValidationInfo<IDocumentProjectEntity>) {
		if (isUndefined(info.value) || isNil(info.value) || info.value === -1) {
			return this.validationUtils.createErrorObject({ key: 'cloud.common.emptyOrNullValueErrorMessage' });
		}

		const documentCategoryLookupService = ServiceLocator.injector.get(BasicsSharedProjectDocumentCategoryLookupService);
		const categoryRes = await firstValueFrom(documentCategoryLookupService.getList());
		const data = categoryRes as unknown as IBasicsCustomizeProjectDocumentCategoryEntity[];
		if (data.length > 0) {
			const defaultData = data.find((item) => item.IsDefault && item.IsLive);
			if (defaultData) {
				info.entity.PrjDocumentCategoryFk = defaultData.Id;
			} else {
				info.entity.PrjDocumentCategoryFk = null;
				this.isMandatoryValidation(info);
			}
		} else {
			info.entity.PrjDocumentCategoryFk = null;
			this.isMandatoryValidation(info);
		}

		if (!isNil(info.entity.PrjDocumentTypeFk) && !isUndefined(info.entity.PrjDocumentTypeFk) && info.entity.PrjDocumentCategoryFk) {
			this.GetDocumentTypeByDocumentCategory(info.entity.PrjDocumentCategoryFk as number).then(async (res) => {
				if (!isNil(res)) {
					const data = res as unknown as IValidateRubcategoryHttpResponseEntity[];
					const defaultData = data.find((item) => item.Isdefault && item.IsLive);
					let isDft = 0;
					if (defaultData) {
						info.entity.PrjDocumentCategoryFk = defaultData.Id;
						isDft = 1;
					}
					if (isDft === 0 && !isNil(data[0])) {
						info.entity.PrjDocumentTypeFk = data[0].Id;
					}
					this.isMandatory(info);
				} else {
					info.entity.PrjDocumentTypeFk = null;
					const arrayDocumentType = await lastValueFrom(this.documentSharedDocumentTypeLookupService.getList());
					if (arrayDocumentType) {
						const documentTypeEntity = arrayDocumentType.find((e) => e.IsDefault && e.IsLive);
						if (documentTypeEntity) {
							info.entity.PrjDocumentTypeFk = documentTypeEntity.Id;
						} else {
							this.isMandatory(info);
						}
					}
				}
			});
		}

		return this.isMandatory(info);
	}

	private asyncValidatePrjDocumentCategoryFk(info: ValidationInfo<IDocumentProjectEntity>) {
		return this.setDocumentCategoryFk(info);
	}

	public async setDocumentCategoryFk(info: ValidationInfo<IDocumentProjectEntity>) {
		if (isUndefined(info.value) || info.value === null || info.value === -1) {
			return this.validationUtils.createErrorObject({ key: 'cloud.common.emptyOrNullValueErrorMessage' });
		}

		info.entity.PrjDocumentCategoryFk = number(info.value.toString());
		const data = (await this.GetDocumentTypeByDocumentCategory(info.entity.PrjDocumentCategoryFk)) as IProjectDocumentTypeEntity[];
		if (data.length > 0) {
			const defaultData = data.find((item) => item.IsDefault === true);
			if (defaultData) {
				info.entity.PrjDocumentTypeFk = defaultData.Id;
			} else {
				info.entity.PrjDocumentTypeFk = data[0].Id;
			}
		} else {
			info.entity.PrjDocumentTypeFk = null;
			const arrayDocumentType = await lastValueFrom(this.documentSharedDocumentTypeLookupService.getList());
			if (arrayDocumentType) {
				const documentTypeEntity = arrayDocumentType.find((e) => e.IsDefault && e.IsLive);
				if (documentTypeEntity) {
					info.entity.PrjDocumentTypeFk = documentTypeEntity.Id;
				} else {
					return { apply: true, valid: false };
				}
			}
		}
		return this.isMandatory(info);
	}

	private validatePrjDocumentTypeFk(info: ValidationInfo<IDocumentProjectEntity>) {
		if (info.value === 0 || isNil(info.value)) {
			info.entity.PrjDocumentTypeFk = null;
			return this.isMandatory(info);
		}
		return new ValidationResult();
	}

	public validateDocumentCategoryFkFromWizard(info: ValidationInfo<IDocumentProjectEntity>) {
		return this.setDocumentTypeFk(info);
	}

	public setDocumentTypeFk(info: ValidationInfo<IDocumentProjectEntity>) {
		if (isUndefined(info.value) || isEmpty(info.value) || info.value === null || info.value === -1) {
			return this.validationUtils.createErrorObject({ key: 'cloud.common.emptyOrNullValueErrorMessage' });
		}
		const documentTypeFk = info.value as number;
		this.GetDocumentTypeByDocumentCategory(documentTypeFk).then(async (res) => {
			const documentTypes = res as IProjectDocumentTypeEntity[];
			if (documentTypes.length > 0) {
				const defaultData = documentTypes.find((item) => item.IsDefault === true);
				if (defaultData) {
					info.entity.PrjDocumentTypeFk = defaultData.Id;
				} else {
					info.entity.PrjDocumentTypeFk = documentTypes[0].Id;
				}
				this.isMandatory(info);
			} else {
				const arrayDocumentType = await lastValueFrom(this.documentSharedDocumentTypeLookupService.getList());
				if (arrayDocumentType) {
					const documentTypeEntity = arrayDocumentType.find((e) => e.IsDefault && e.IsLive);
					if (documentTypeEntity) {
						info.entity.PrjDocumentTypeFk = documentTypeEntity.Id;
					}
				}
			}
		});
		return this.validationUtils.createSuccessObject();
	}

	public cancelValidate(fiels: string[], entity: IDocumentProjectEntity) {
		fiels.forEach((e) => {
			this.getEntityRuntimeData().removeInvalid(entity, { result: new ValidationResult(), field: e });
		});
	}

	private async GetDocumentTypeByDocumentCategory(category: number) {
		const response = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'documents/projectdocument/GetDocumentTypeByDocumentCategory?category=' + category));
		return response;
	}
}
