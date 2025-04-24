/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { PlantGroup2ControllingUnitDataService } from './plant-group-2-controlling-unit-data.service';
import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IPlantGroup2ControllingUnitEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})
export class PlantGroup2ControllingUnitValidationService extends BaseValidationService<IPlantGroup2ControllingUnitEntity> {
	private validators: IValidationFunctions<IPlantGroup2ControllingUnitEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IPlantGroup2ControllingUnitEntity>> = PlatformSchemaService<IPlantGroup2ControllingUnitEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Resource.EquipmentGroup', typeName: 'PlantGroup2ControllingUnitDto'}).then(
			function(scheme) {
				self.validators = new ValidationServiceFactory<IPlantGroup2ControllingUnitEntity>().provideValidationFunctionsFromScheme(scheme, self);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IPlantGroup2ControllingUnitEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPlantGroup2ControllingUnitEntity> {
		return inject(PlantGroup2ControllingUnitDataService);
	}
}