/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { BasicsCompanyPeriodLookupService, BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ControllingRevenueRecognitionDataService } from './revenue-recognition-data.service';
import { IPrrHeaderEntity } from '../model/entities/prr-header-entity.interface';
import { firstValueFrom } from 'rxjs';
import { zonedTimeToUtc } from 'date-fns-tz';

/**
 * Controlling Revenue Recognition  validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ControllingRevenueRecognitionValidationService extends BaseValidationService<IPrrHeaderEntity> {
	private readonly basicsCompanyPeriodLookupService = inject(BasicsCompanyPeriodLookupService);
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(ControllingRevenueRecognitionDataService);

	protected generateValidationFunctions(): IValidationFunctions<IPrrHeaderEntity> {
		return {
			CompanyYearFk: this.validateCompanyYearFk,
			CompanyPeriodFk: this.validateCompanyPeriodFk,
			PrjProjectFk: this.validatePrjProjectFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrrHeaderEntity> {
		return this.dataService;
	}

	protected async validateCompanyYearFk(info: ValidationInfo<IPrrHeaderEntity>): Promise<ValidationResult> {
		return this.validationUtils.isMandatory(info);
	}

	protected async validateCompanyPeriodFk(info: ValidationInfo<IPrrHeaderEntity>): Promise<ValidationResult> {
		const basicCompanyPeriod = await firstValueFrom(this.basicsCompanyPeriodLookupService.getItemByKey({id: info.value as number}));
		if (basicCompanyPeriod.StartDate) {
			info.entity.CompanyPeriodFkStartDate = zonedTimeToUtc(basicCompanyPeriod.StartDate, 'UTC');
		}
		if (basicCompanyPeriod.EndDate) {
			info.entity.CompanyPeriodFkEndDate = zonedTimeToUtc(basicCompanyPeriod.EndDate, 'UTC');
		}
		return this.validatePeriodAndProject(info, info.entity.PrjProjectFk, <number>info.value);
	}

	protected async validatePrjProjectFk(info: ValidationInfo<IPrrHeaderEntity>): Promise<ValidationResult> {
		return this.validatePeriodAndProject(info, <number>info.value, info.entity.CompanyPeriodFk);
	}

	private async validatePeriodAndProject(info: ValidationInfo<IPrrHeaderEntity>, projectFk: number, companyPeriodFk: number): Promise<ValidationResult> {
		const groupObject = {
			PrjProjectFk: projectFk,
			CompanyPeriodFk: companyPeriodFk,
		};
		const errorMessage = {
			key: 'controlling.revrecognition.errorCompanyPeriodMustBeUniquePrjContext',
			params: {field1: 'Project', field2: 'Company Period'}
		};
		const result = this.validationUtils.isGroupUnique(info, this.dataService.getList(), groupObject, errorMessage);
		if (!result.valid) {
			return result;
		}
		return this.validationUtils.isAsyncGroupUnique(info, 'controlling/RevenueRecognition/isPeriodUniqueForProject', groupObject, errorMessage);
	}
}