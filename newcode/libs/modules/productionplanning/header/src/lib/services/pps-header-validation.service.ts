/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { PpsHeaderDataService } from './pps-header-data.service';
import { IPpsHeaderEntity } from '@libs/productionplanning/shared';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PpsHeaderValidationService extends BaseValidationService<IPpsHeaderEntity> {

	private dataService = inject(PpsHeaderDataService);
	private translateService: PlatformTranslateService = inject(PlatformTranslateService);
	protected http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);

	protected generateValidationFunctions(): IValidationFunctions<IPpsHeaderEntity> {
		return {
			Code: this.asyncValidateCode,
			PrjProjectFk: this.validatePrjProjectFk,
			BasClerkPrpFk: this.validateBasClerkPrpFk,
			BasSiteFk: this.validateBasSiteFk,
			LgmJobFk: this.validateLgmJobFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsHeaderEntity> {
		return this.dataService;
	}

	private async asyncValidateCode(info: ValidationInfo<IPpsHeaderEntity>): Promise<ValidationResult> {
		const result = this.validateIsMandatory(info);
		if (!result.valid) {
			return result;
		}
		const postData = { Id: info.entity.Id, Code: info.value, prjProjectFk: info.entity.PrjProjectFk };
		const res = await firstValueFrom(this.http.post(this.configurationService.webApiBaseUrl + 'productionplanning/header/isuniquecode', postData));
		const isUnique = res as boolean;
		const uniqueResult = isUnique ? new ValidationResult()
			: new ValidationResult(this.translateService.instant('productionplanning.common.errors.uniqCode').text);
		return uniqueResult;
	}

	private validatePrjProjectFk(info: ValidationInfo<IPpsHeaderEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	private validateBasClerkPrpFk(info: ValidationInfo<IPpsHeaderEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	private validateBasSiteFk(info: ValidationInfo<IPpsHeaderEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	private validateLgmJobFk(info: ValidationInfo<IPpsHeaderEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

}