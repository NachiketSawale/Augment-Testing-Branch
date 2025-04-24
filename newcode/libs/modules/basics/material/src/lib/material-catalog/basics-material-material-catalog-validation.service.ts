/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { BasicsMaterialMaterialCatalogDataService } from './basics-material-material-catalog-data.service';
import { BasicsSharedDataValidationService, IMaterialCatalogEntity } from '@libs/basics/shared';

/**
 * Material catalog validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialMaterialCatalogValidationService extends BaseValidationService<IMaterialCatalogEntity> {
	private dataService = inject(BasicsMaterialMaterialCatalogDataService);
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
