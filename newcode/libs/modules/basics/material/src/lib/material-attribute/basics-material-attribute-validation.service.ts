/*
 * Copyright(c) RIB Software GmbH
 */
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { BasicsMaterialAttributeDataService } from './basics-material-attribute-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IMaterialCharacteristicEntity } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialAttributeValidationService extends BaseValidationService<IMaterialCharacteristicEntity> {
	private dataService = inject(BasicsMaterialAttributeDataService);
	private validationService = inject(BasicsSharedDataValidationService);

	protected validatePropertyInfo(info: ValidationInfo<IMaterialCharacteristicEntity>): ValidationResult {
		return this.validationService.isUnique(this.dataService, info, this.dataService.getList());
	}

	protected generateValidationFunctions(): IValidationFunctions<IMaterialCharacteristicEntity> {
		return {
			PropertyInfo: this.validatePropertyInfo,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialCharacteristicEntity> {
		return this.dataService;
	}
}
