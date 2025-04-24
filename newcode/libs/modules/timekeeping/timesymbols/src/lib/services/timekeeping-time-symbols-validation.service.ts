/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ITimeSymbolEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeSymbolsDataService } from './timekeeping-time-symbols-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimeSymbolsValidationService extends BaseValidationService<ITimeSymbolEntity> {

	private dataService = inject(TimekeepingTimeSymbolsDataService);
	private validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	private translationService: PlatformTranslateService = inject(PlatformTranslateService);
	protected override generateValidationFunctions(): IValidationFunctions<ITimeSymbolEntity> {
		return {
			Code: [this.validateCode, this.asyncValidateCode],
			TimeSymbolGroupFk: [this.validateTimeSymbolGroupFk]
		};
	}

	protected validateCode(info: ValidationInfo<ITimeSymbolEntity>): ValidationResult {
		const list = this.dataService.getList();
		const validateResult = this.validationService.isUnique(this.dataService, info, list);
		if (!validateResult.valid) {
			validateResult.error = this.translationService.instant('timekeeping.timesymbols.entityUniqueCode').text;
		}
		return validateResult;
	}

	protected validateTimeSymbolGroupFk(info: ValidationInfo<ITimeSymbolEntity>): ValidationResult {
		return this.validationService.isMandatory(info,
			this.translationService.instant('timekeeping.timesymbols.entityTimeSymbolGroupFk'));
	}

	protected async asyncValidateCode(info: ValidationInfo<ITimeSymbolEntity>): Promise<ValidationResult> {
		return await this.validationService.isAsyncUnique(info, 'timekeeping/timesymbols/isunique', 'cloud.common.code');
	}


	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ITimeSymbolEntity> {
		return this.dataService;
	}

}