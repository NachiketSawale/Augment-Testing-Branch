/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { PlantGroupSpecificValueDataService } from './plant-group-specific-value-data.service';
import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IPlantGroupSpecificValueEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})
export class PlantGroupSpecificValueValidationService extends BaseValidationService<IPlantGroupSpecificValueEntity> {
	private validators: IValidationFunctions<IPlantGroupSpecificValueEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IPlantGroupSpecificValueEntity>> = PlatformSchemaService<IPlantGroupSpecificValueEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Resource.EquipmentGroup', typeName: 'PlantGroupSpecificValueDto'}).then(
			function(scheme) {
				self.validators = new ValidationServiceFactory<IPlantGroupSpecificValueEntity>().provideValidationFunctionsFromScheme(scheme, self);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IPlantGroupSpecificValueEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPlantGroupSpecificValueEntity> {
		return inject(PlantGroupSpecificValueDataService);
	}
}