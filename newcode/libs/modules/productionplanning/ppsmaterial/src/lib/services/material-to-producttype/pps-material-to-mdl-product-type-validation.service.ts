/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IPpsMaterial2MdlProductTypeEntity } from '../../model/models';
import { PpsMaterialToMdlProductTypeDataService } from './pps-material-to-mdl-product-type-data.service';

@Injectable({
	providedIn: 'root'
})
export class PpsMaterialToMdlProductTypeValidationService extends BaseValidationService<IPpsMaterial2MdlProductTypeEntity> {

	private readonly dataService = inject(PpsMaterialToMdlProductTypeDataService);

	protected generateValidationFunctions(): IValidationFunctions<IPpsMaterial2MdlProductTypeEntity> {
		return {
			ProductCategory: this.validateProductCategory,
			PpsMaterialFk: [this.validatePpsMaterialFk],
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsMaterial2MdlProductTypeEntity> {
		return this.dataService;
	}

	private validateProductCategory(info: ValidationInfo<IPpsMaterial2MdlProductTypeEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	private validatePpsMaterialFk(info: ValidationInfo<IPpsMaterial2MdlProductTypeEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}
}
