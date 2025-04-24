/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { PlantGroupAccountDataService } from './plant-group-account-data.service';
import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IPlantGroupAccountEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})
export class PlantGroupAccountValidationService extends BaseValidationService<IPlantGroupAccountEntity> {
	private validators: IValidationFunctions<IPlantGroupAccountEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IPlantGroupAccountEntity>> = PlatformSchemaService<IPlantGroupAccountEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Resource.EquipmentGroup', typeName: 'PlantGroupAccountDto'}).then(
			function(scheme) {
				self.validators = new ValidationServiceFactory<IPlantGroupAccountEntity>().provideValidationFunctionsFromScheme(scheme, self);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IPlantGroupAccountEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPlantGroupAccountEntity> {
		return inject(PlantGroupAccountDataService);
	}
}