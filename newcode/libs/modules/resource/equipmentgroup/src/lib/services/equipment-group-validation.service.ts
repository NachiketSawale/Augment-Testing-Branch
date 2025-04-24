/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EquipmentGroupDataService } from './equipment-group-data.service';
import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IEquipmentGroupEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})
export class EquipmentGroupValidationService extends BaseValidationService<IEquipmentGroupEntity> {
	private validators: IValidationFunctions<IEquipmentGroupEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IEquipmentGroupEntity>> = PlatformSchemaService<IEquipmentGroupEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Resource.EquipmentGroup', typeName: 'EquipmentGroupDto'}).then(
			function(scheme) {
				self.validators = new ValidationServiceFactory<IEquipmentGroupEntity>().provideValidationFunctionsFromScheme(scheme, self);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IEquipmentGroupEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEquipmentGroupEntity> {
		return inject(EquipmentGroupDataService);
	}
}