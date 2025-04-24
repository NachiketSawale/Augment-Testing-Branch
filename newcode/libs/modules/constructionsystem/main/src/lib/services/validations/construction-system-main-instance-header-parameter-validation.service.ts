/*
 * Copyright(c) RIB Software GmbH
 */

import { Inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IInstanceHeaderParameterEntity } from '../../model/entities/instance-header-parameter-entity.interface';
import { ConstructionSystemMainInstanceHeaderParameterDataService } from '../construction-system-main-instance-header-parameter-data.service';
import { ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMainGlobalParameterLookupService } from '../lookup/construction-system-main-global-parameter-lookup.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstanceHeaderParameterValidationService extends BaseValidationService<IInstanceHeaderParameterEntity> {
	private readonly dataService = Inject(ConstructionSystemMainInstanceHeaderParameterDataService);

	protected generateValidationFunctions(): IValidationFunctions<IInstanceHeaderParameterEntity> {
		return {
			ParameterValueVirtual: this.validateParameterValueVirtual,
		};
	}

	protected validateParameterValueVirtual(info: ValidationInfo<IInstanceHeaderParameterEntity>): ValidationResult {
		const entity = info.entity;
		entity.ParameterValueVirtual = info.value as string | number | boolean | Date | null;
		entity.ParameterValue = entity.ParameterValueVirtual;

		const globalParameters = ServiceLocator.injector.get(ConstructionSystemMainGlobalParameterLookupService).cache.getList();
		const parameterItem = globalParameters.find((item) => item.Id === entity.CosGlobalParamFk);
		if (parameterItem?.IsLookup) {
			entity.CosGlobalParamvalueFk = info.value ? Number(info.value) : null;
		}
		return new ValidationResult();
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IInstanceHeaderParameterEntity> {
		return this.dataService;
	}
}
