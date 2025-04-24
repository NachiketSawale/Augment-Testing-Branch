/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsMaterialGroupCharValDataService } from './basics-material-group-char-val-data.service';
import { IMaterialGroupCharvalEntity } from '../model/entities/material-group-charval-entity.interface';

/**
 * Material group attribute value validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialGroupCharValidationService extends BaseValidationService<IMaterialGroupCharvalEntity> {
	private dataService = inject(BasicsMaterialGroupCharValDataService);
	private validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<IMaterialGroupCharvalEntity> {
		return {
			CharacteristicInfo: this.validateCharacteristic,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialGroupCharvalEntity> {
		return this.dataService;
	}

	// todo - validation is not fired due to bug in the platform https://rib-40.atlassian.net/browse/DEV-33818
	protected validateCharacteristic(info: ValidationInfo<IMaterialGroupCharvalEntity>): ValidationResult {
		return this.validationUtils.isUnique(this.dataService, info, this.dataService.getList(), true);
	}
}
