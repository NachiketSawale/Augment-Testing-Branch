// remark: current file is copied from basics-material-material-group-validation.service in basics.material, 
// should be replaced by other way(like LazyInjectionToken from basics.material module) in the future
/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { PpsMaterialGroupDataService } from './material-group-data.service';
import { BasicsSharedDataValidationService, IMaterialGroupEntity } from '@libs/basics/shared';

/**
 * Material group validation service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsMaterialGroupValidationService extends BaseValidationService<IMaterialGroupEntity> {
	private dataService = inject(PpsMaterialGroupDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<IMaterialGroupEntity> {
		return {
			IsChecked: this.validateIsChecked,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialGroupEntity> {
		return this.dataService;
	}

	private validateIsChecked(info: ValidationInfo<IMaterialGroupEntity>): ValidationResult {
		const item = info.entity;
		const value = info.value as boolean;
		item.IsChecked = value;
		this.dataService.fireFilterChanged(item, value);
		return this.validationUtils.createSuccessObject();
	}
}
