/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IPropertyKeyComparisonExclusionEntity } from '../model/entities/property-key-comparison-exclusion-entity.interface';
import { ModelAdministrationPropertyKeyComparisonExclusionDataService } from './property-key-comparison-exclusion-data.service';

/**
 * The validation service for the property key comparison exclusion entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationPropertyKeyComparisonExclusionValidationService
	extends BaseValidationService<IPropertyKeyComparisonExclusionEntity> {

	private readonly dataSvc = inject(ModelAdministrationPropertyKeyComparisonExclusionDataService);

	private readonly dataValSvc = inject(BasicsSharedDataValidationService);

	protected override generateValidationFunctions(): IValidationFunctions<IPropertyKeyComparisonExclusionEntity> {
		return {
			PropertyKeyFk: info => this.dataValSvc.isMandatory(info)
		};
	}

	protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPropertyKeyComparisonExclusionEntity> {
		return this.dataSvc;
	}
}
