// remark: current file is copied from basics-material-material-catalog-validation.service in basics.material, 
// should be replaced by other way(like LazyInjectionToken from basics.material module) in the future
/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { PpsMaterialCatalogDataService } from './material-catalog-data.service';
import { BasicsSharedDataValidationService, IMaterialCatalogEntity } from '@libs/basics/shared';

/**
 * Material catalog validation service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsMaterialCatalogValidationService extends BaseValidationService<IMaterialCatalogEntity> {
	private dataService = inject(PpsMaterialCatalogDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<IMaterialCatalogEntity> {
		return {
			IsChecked: this.validateIsChecked,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialCatalogEntity> {
		return this.dataService;
	}

	private validateIsChecked(info: ValidationInfo<IMaterialCatalogEntity>): ValidationResult {

		const item = info.entity;
		const value = info.value as boolean;
		item.IsChecked = value;
		this.dataService.fireFilterChanged(item, value);
		return this.validationUtils.createSuccessObject();
	}
}
