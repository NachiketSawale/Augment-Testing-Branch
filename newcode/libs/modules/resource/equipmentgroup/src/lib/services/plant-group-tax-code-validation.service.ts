/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { PlantGroupTaxCodeDataService } from './plant-group-tax-code-data.service';
import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IPlantGroupTaxCodeEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})
export class PlantGroupTaxCodeValidationService extends BaseValidationService<IPlantGroupTaxCodeEntity> {
	private validators: IValidationFunctions<IPlantGroupTaxCodeEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IPlantGroupTaxCodeEntity>> = PlatformSchemaService<IPlantGroupTaxCodeEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Resource.EquipmentGroup', typeName: 'PlantGroupTaxCodeDto'}).then(
			function(scheme) {
				self.validators = new ValidationServiceFactory<IPlantGroupTaxCodeEntity>().provideValidationFunctionsFromScheme(scheme, self);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IPlantGroupTaxCodeEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPlantGroupTaxCodeEntity> {
		return inject(PlantGroupTaxCodeDataService);
	}
}