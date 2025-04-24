/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { BasicsCompanyLookupService, BasicsSharedDataValidationService } from '@libs/basics/shared';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BusinessPartner2CompanyDataService } from '../businesspartner-2company-data.service';
import { firstValueFrom } from 'rxjs';
import { IBusinessPartner2CompanyEntity } from '@libs/businesspartner/interfaces';


@Injectable({
	providedIn: 'root'
})
export class BusinessPartner2CompanyValidationService extends BaseValidationService<IBusinessPartner2CompanyEntity> {

	// region basic
	private dataService: BusinessPartner2CompanyDataService = inject(BusinessPartner2CompanyDataService);
	protected translateService = inject(PlatformTranslateService);
	private validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	protected override generateValidationFunctions(): IValidationFunctions<IBusinessPartner2CompanyEntity> {
		return {
			CompanyFk: this.asyncValidateCompanyFk
		};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBusinessPartner2CompanyEntity> {
		return this.dataService;
	}
	// endregion
	// region validate
	protected async asyncValidateCompanyFk(info: ValidationInfo<IBusinessPartner2CompanyEntity>): Promise<ValidationResult> {
		const value = info.value as number;
		let result: ValidationResult;
		result = this.requireValidator(value, MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityCompany');
		if (!result.valid) {
			return result;
		}
		const dataListToCheck = [...this.dataService.getList()];
		result = this.validationService.isUnique(this.dataService, info, dataListToCheck);
		if (!result.valid) {
			return result;
		}

		const companyLookupService = ServiceLocator.injector.get(BasicsCompanyLookupService);
		const dataCompany = await firstValueFrom(companyLookupService.getItemByKey({id: value}));
		if (dataCompany){
			result = this.companyTypeValidator(dataCompany.CompanyTypeFk);
			if (result.valid) {
				info.entity.CompanyResponsibleFk = dataCompany.Id;
				info.entity.BasClerkFk = dataCompany.ClerkFk; // default value from company.
			}
		}
		return result;
	}

	private requireValidator(value: number, modelTrKey: string): ValidationResult {
		const result: ValidationResult = { apply: true, valid: true };
		if (value === -1) {
			result.valid = false;
			result.error = this.translateService.instant({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: {fieldName: this.translateService.instant(modelTrKey)}
			}).text;
		}
		return result;
	}

	private companyTypeValidator(companyTypeId: number): ValidationResult {
		const result: ValidationResult = {apply: true, valid: true};
		if (companyTypeId === 2) {
			result.valid = false;
			result.error = this.translateService.instant({
				key: 'cloud.common.companyWithWrongCompanyTypeErrorMessage'
			}).text;
		}
		return result;
	}
}