/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { PlantGroup2CostCodeDataService } from './plant-group-2-cost-code-data.service';
import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IPlantGroup2CostCodeEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})
export class PlantGroup2CostCodeValidationService extends BaseValidationService<IPlantGroup2CostCodeEntity> {
	private validators: IValidationFunctions<IPlantGroup2CostCodeEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IPlantGroup2CostCodeEntity>> = PlatformSchemaService<IPlantGroup2CostCodeEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Resource.EquipmentGroup', typeName: 'PlantGroup2CostCodeDto'}).then(
			function(scheme) {
				self.validators = new ValidationServiceFactory<IPlantGroup2CostCodeEntity>().provideValidationFunctionsFromScheme(scheme, self);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IPlantGroup2CostCodeEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPlantGroup2CostCodeEntity> {
		return inject(PlantGroup2CostCodeDataService);
	}
}