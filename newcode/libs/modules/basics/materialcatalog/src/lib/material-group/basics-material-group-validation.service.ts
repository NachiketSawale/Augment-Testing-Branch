/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService, IMaterialGroupEntity } from '@libs/basics/shared';
import { BasicsMaterialGroupDataService } from './basics-material-group-data.service';

/**
 * Material group validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialGroupValidationService extends BaseValidationService<IMaterialGroupEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsMaterialGroupDataService);

	protected generateValidationFunctions(): IValidationFunctions<IMaterialGroupEntity> {
		return {
			Code: this.validateCode,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialGroupEntity> {
		return this.dataService;
	}

	protected validateCode(info: ValidationInfo<IMaterialGroupEntity>): ValidationResult {
		return this.validationUtils.isUnique(this.dataService, info, this.dataService.flatList());
	}
}
