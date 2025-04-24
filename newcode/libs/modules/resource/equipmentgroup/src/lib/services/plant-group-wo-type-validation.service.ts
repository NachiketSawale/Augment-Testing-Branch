/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { PlantGroupWoTypeDataService } from './plant-group-wo-type-data.service';
import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IPlantGroupWoTypeEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})
export class PlantGroupWoTypeValidationService extends BaseValidationService<IPlantGroupWoTypeEntity> {
	private validators: IValidationFunctions<IPlantGroupWoTypeEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IPlantGroupWoTypeEntity>> = PlatformSchemaService<IPlantGroupWoTypeEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Resource.EquipmentGroup', typeName: 'PlantGroupWoTypeDto'}).then(
			function(scheme) {
				self.validators = new ValidationServiceFactory<IPlantGroupWoTypeEntity>().provideValidationFunctionsFromScheme(scheme, self);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IPlantGroupWoTypeEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPlantGroupWoTypeEntity> {
		return inject(PlantGroupWoTypeDataService);
	}
}