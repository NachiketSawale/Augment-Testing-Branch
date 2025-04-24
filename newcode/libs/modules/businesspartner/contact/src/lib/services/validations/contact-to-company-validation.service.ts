import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {
	MODULE_INFO_BUSINESSPARTNER
} from '@libs/businesspartner/common';
import {inject} from '@angular/core';
import {BasicsCompanyLookupService, BasicsSharedDataValidationService} from '@libs/basics/shared';
import {Contact2CompanyDataService} from '../contact-to-company-data.service';
import {PlatformTranslateService, ServiceLocator} from '@libs/platform/common';
import {set} from 'lodash';
import { IContact2BasCompanyEntity } from '@libs/businesspartner/interfaces';

export class Contact2CompanyValidationService extends BaseValidationService<IContact2BasCompanyEntity> {
	private dataService = inject(Contact2CompanyDataService);
	private validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	private translationService: PlatformTranslateService = inject(PlatformTranslateService);

	protected override generateValidationFunctions(): IValidationFunctions<IContact2BasCompanyEntity> {
		return {
			CompanyFk: this.asyncValidateCompanyFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IContact2BasCompanyEntity> {
		return this.dataService;
	}

	protected asyncValidateCompanyFk(info: ValidationInfo<IContact2BasCompanyEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		let result = this.requireValidator(value,  MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityCompany');
		if (!result.valid) {
			return Promise.resolve(result);
		}

		const dataListToCheck = [...this.dataService.getList()]; // todo chi: check whether right to copy array

		if (dataListToCheck.length > 0) {
			result = this.validationService.isUnique(this.getEntityRuntimeData(), info,  dataListToCheck);
		}

		if (!result.valid) {
			return Promise.resolve(result);
		}

		const companyLookupService = ServiceLocator.injector.get(BasicsCompanyLookupService);
		return new Promise((resolve, reject) => {
			companyLookupService.getItemByKey({id: value}).subscribe({
				next: company => {
					result = this.companyTypeValidator(company.CompanyTypeFk);
					if (result.valid) {
						set(entity, 'BasCompanyResponsibleFk', company.Id);
						set(entity, 'BasClerkFk', company.ClerkFk); // default value from company.
					}

					resolve(result);
				},
				error: () => {
					reject();
				}
			});
		});
	}

	private requireValidator(value: number, modelTrKey: string): ValidationResult {
		const result: ValidationResult = {apply: true, valid: true};
		if (value === -1) {
			result.valid = false;
			result.error = this.translationService.instant({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: {fieldName: this.translationService.instant(modelTrKey)}}).text;
		}
		return result;
	}

	private companyTypeValidator(companyTypeId: number): ValidationResult {
		const result: ValidationResult = {apply: true, valid: true};
		if (companyTypeId === 2) {
			result.valid = false;
			result.error = this.translationService.instant({
				key: 'cloud.common.companyWithWrongCompanyTypeErrorMessage'
			}).text;
		}
		return result;
	}
}