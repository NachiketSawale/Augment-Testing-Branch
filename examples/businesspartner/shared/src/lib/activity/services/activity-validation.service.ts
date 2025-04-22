/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IIdentificationData, PlatformTranslateService } from '@libs/platform/common';
import { BasicsCompanyLookupService, CompanyEntity } from '@libs/basics/shared';
import { lastValueFrom } from 'rxjs';
import { IActivityEntity } from '@libs/businesspartner/interfaces';
import { ActivityDataBaseService } from './activity-data-base.service';

export class ActivityValidationService<T extends object, PT extends object> extends BaseValidationService<IActivityEntity> {
	public constructor(private activityDataService: ActivityDataBaseService<T, PT>) {
		super();
	}
	/// region basic
	protected readonly translateService = inject(PlatformTranslateService);
	private readonly companyLookupService = inject(BasicsCompanyLookupService<CompanyEntity>);
	protected override generateValidationFunctions(): IValidationFunctions<IActivityEntity> {
		return {
			ActivityTypeFk: this.ValidateActivityTypeFk,
			ActivityDate: this.validateActivityDate,
			validateFromDate: this.validateFromDate,
			CompanyResponsibleFk: this.validateCompanyResponsibleFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IActivityEntity> {
		return this.activityDataService;
	}
	/// endregion
	// region  validate
	public ValidateActivityTypeFk(info: ValidationInfo<IActivityEntity>): ValidationResult {
		const validationResult: ValidationResult = { apply: true, valid: true };
		if (!info.value || info.value === -1) {
			validationResult.valid = false;
			validationResult.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', { fieldName: info.field }).text;
		}
		return validationResult;
	}
	protected validateActivityDate(info: ValidationInfo<IActivityEntity>): ValidationResult {
		const validationResult: ValidationResult = { apply: true, valid: true };
		// The already existing "Activity Date" would in this case indicate the end date ("To Date").
		// it should be greater than 'FromDate'.Otherwise, it is wrong.
		const fromDate = info.entity.FromDate;
		if (!!info.value && !!fromDate && info.value < fromDate) {
			const fieldName1 = this.translateService.instant('businesspartner.main.bpActivityDate').text;
			const fieldName2 = this.translateService.instant('cloud.common.fromDate').text;
			validationResult.valid = false;
			validationResult.error = this.translateService.instant('cloud.common.endDateError', { field1: fieldName1, field2: fieldName2 }).text;
		}
		if (validationResult.valid && fromDate) {
			const dataFromDate: ValidationInfo<IActivityEntity> = {
				entity: info.entity,
				value: fromDate,
				field: 'FromDate',
			};
			this.validateFieldsHelper(dataFromDate);
		}
		return validationResult;
	}
	protected validateFromDate(info: ValidationInfo<IActivityEntity>): ValidationResult {
		const validationResult: ValidationResult = { apply: true, valid: true };

		// This date is meant to indicate the starting date for activities that extend over a certain time period.
		// it should be less than 'ActivityDate'. Otherwise, it is wrong.
		const activityDate = info.entity.ActivityDate;
		if (!!info.value && !!activityDate && activityDate < info.value) {
			const fieldName1 = this.translateService.instant('cloud.common.fromDate').text;
			const fieldName2 = this.translateService.instant('businesspartner.main.bpActivityDate').text;
			validationResult.valid = false;
			validationResult.error = this.translateService.instant('cloud.common.startDateError', { field1: fieldName1, field2: fieldName2 }).text;
		}
		if (validationResult.valid && activityDate) {
			const dataActivityDate: ValidationInfo<IActivityEntity> = {
				entity: info.entity,
				value: activityDate,
				field: 'ActivityDate',
			};
			this.validateFieldsHelper(dataActivityDate);
		}
		return validationResult;
	}
	// can be used to validate another field when validate one.

	protected async validateCompanyResponsibleFk(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {
		const validationResult: ValidationResult = { apply: true, valid: true };
		const data: IIdentificationData = {
			id: info.entity.CompanyFk,
		};
		const dataCompany = await lastValueFrom(this.companyLookupService.getItemByKey(data));
		if (dataCompany) {
			info.entity.ClerkFk = dataCompany.ClerkFk;
			//todo dataService.gridRefresh();
		}
		return validationResult;
	}
	// endregion
	// region private function
	private validateFieldsHelper(info: ValidationInfo<IActivityEntity>): void {
		// todo validateFieldsHelper
		//platformRuntimeDataService.applyValidationResult(result, entity, model);
		//platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
	}
	// endregion
}
