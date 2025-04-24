/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IJobEntity } from '@libs/logistic/interfaces';
import { LogisticJobDataService } from './logistic-job-data.service';
import { get, isObject } from 'lodash';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';


/**
 * Logistic job sundry service price validation service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticJobValidationService extends BaseValidationService<IJobEntity> {


	private dataService = inject(LogisticJobDataService);
	private validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	private translationService: PlatformTranslateService = inject(PlatformTranslateService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<IJobEntity> {
		return {
			LogisticContextFk:this.validateIsMandatory,
			JobTypeFk:this.validateIsMandatory,
			RubricCategoryFk:this.validateIsMandatory,
			CompanyFk:this.validateIsMandatory,
			IsLive:this.validateIsMandatory,
			CalCalendarFk:this.validateIsMandatory,
			IsProjectDefault:this.validateIsMandatory,
			CurrencyFk:this.validateIsMandatory,
			ValidFrom : this.validateValidFrom,
			ValidTo:this.validateValidTo,
			Code:this.asyncValidateCode
		};
	}

	//TODO:platformValidationRevalidationEntitiesFactory.addValidationServiceInterface(
	// SettledByTypeFk, PlantFk, PlantGroupFk, ControllingUnitFk, BusinessPartnerFk, CustomerFk)


	private async asyncValidateCode(info: ValidationInfo<IJobEntity>): Promise<ValidationResult> {
		const response = await this.validationService.isAsyncUnique(info, 'logistic/job/IsCodeUnique','cloud.common.code');
		const entityValue = get(info.entity, info.field);
		if (!entityValue && isObject(response)) {
			response.apply = true;
		}
		return response;
	}


	//TODO:validateJobTypeFk - platformDataValidationService, basicsCompanyNumberGenerationInfoService these services are not available



	private validateValidFrom(info: ValidationInfo<IJobEntity>): ValidationResult {
		return this.validateIsValidTimeSpanFrom(info);
	}

	private validateValidTo(info: ValidationInfo<IJobEntity>): ValidationResult {
		return this.validateIsValidTimeSpanTo(info);
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IJobEntity> {
		return this.dataService;
	}
}