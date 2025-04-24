/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsMaterialGroupCharDataService } from './basics-material-group-char-data.service';
import { IMaterialGroupCharEntity } from '../model/entities/material-group-char-entity.interface';

/**
 * Material group attribute validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialGroupCharValidationService extends BaseValidationService<IMaterialGroupCharEntity> {
	private dataService = inject(BasicsMaterialGroupCharDataService);
	private validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<IMaterialGroupCharEntity> {
		return {
			PropertyInfo: this.validateProperty,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialGroupCharEntity> {
		return this.dataService;
	}

	// todo - validation is not fired due to bug in the platform https://rib-40.atlassian.net/browse/DEV-33818
	protected validateProperty(info: ValidationInfo<IMaterialGroupCharEntity>): ValidationResult {
		return this.validationUtils.isUnique(this.dataService, info, this.dataService.getList(), true);
	}
}
