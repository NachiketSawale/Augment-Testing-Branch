/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';

import { BasicsMaterialCatalogDiscountGroupDataService } from './basics-material-catalog-discount-group-data.service';
import { IMaterialDiscountGroupEntity } from '../model/entities/material-discount-group-entity.interface';

/**
 * Material catalog discount group validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialCatalogDiscountGroupValidationService extends BaseValidationService<IMaterialDiscountGroupEntity> {
	private dataService = inject(BasicsMaterialCatalogDiscountGroupDataService);
	private validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<IMaterialDiscountGroupEntity> {
		return {
			Code: this.validateCode,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialDiscountGroupEntity> {
		return this.dataService;
	}

	protected validateCode(info: ValidationInfo<IMaterialDiscountGroupEntity>): ValidationResult {
		return this.validationUtils.isUnique(this.dataService, info, this.dataService.flatList());
	}
}
