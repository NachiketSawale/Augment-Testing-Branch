/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsDependentDataDataService } from './basics-dependent-data-data.service';
import { IDependentDataEntity } from '../model/entities/dependent-data-entity.interface';

/**
 * Basics dependentData validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsDependentDataValidationService extends BaseValidationService<IDependentDataEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsDependentDataDataService);

	protected generateValidationFunctions(): IValidationFunctions<IDependentDataEntity> {
		return {
			IsCompanyContext: this.validateContext,
			IsUserContext: this.validateContext,
			IsProjectContext: this.validateContext,
			IsEstimateContext: this.validateContext,
			IsModelContext: this.validateContext,
			BoundContainerUuid: this.validateBoundContainerUuid,
			ModuleFk: this.validateModuleFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IDependentDataEntity> {
		return this.dataService;
	}

	private validateContext(info: ValidationInfo<IDependentDataEntity>) {
		/*todo DEV-30993
		const fieldName = info.field;
		var found = _.find(basicsDependentDataColumnService.getList(), { DatabaseColumn: fieldName });
		if (!found) {
			return this.validationUtils.createErrorObject({ key: 'basics.dependentdata.viewMustContainColumn' });
		} else {
			return this.validationUtils.createSuccessObject();
		}
		 */
		return this.validationUtils.createSuccessObject();
	}

	protected validateBoundContainerUuid(info: ValidationInfo<IDependentDataEntity>): ValidationResult {
		//todo DEV-31842
		return this.validationUtils.createSuccessObject();
	}

	protected validateModuleFk(): ValidationResult {
		//todo DEV-31842
		return this.validationUtils.createSuccessObject();
	}
}