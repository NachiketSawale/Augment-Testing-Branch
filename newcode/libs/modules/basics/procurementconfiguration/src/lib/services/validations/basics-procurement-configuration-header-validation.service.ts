/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsProcurementConfigurationHeaderDataService } from '../basics-procurement-configuration-header-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IPrcConfigHeaderEntity } from '../../model/entities/prc-config-header-entity.interface';

/**
 * The basic validation service for ProcurementConfiguration Header
 */

@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementConfigurationHeaderValidationService extends BaseValidationService<IPrcConfigHeaderEntity> {
	private dataService = inject(BasicsProcurementConfigurationHeaderDataService);
	private validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<IPrcConfigHeaderEntity> {
		return {
			IsDefault: this.validateIsDefault,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcConfigHeaderEntity> {
		return this.dataService;
	}

	/**
	 * validate IsDefault
	 * @param info
	 * @protected
	 */
	protected validateIsDefault(info: ValidationInfo<IPrcConfigHeaderEntity>): ValidationResult {
		return this.validationUtils.validateIsDefault(info, this.dataService);
	}
}
