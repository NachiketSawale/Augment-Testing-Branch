/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EquipmentGroupEurolistDataService } from './equipment-group-eurolist-data.service';
import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IEquipmentGroupEurolistEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})
export class EquipmentGroupEurolistValidationService extends BaseValidationService<IEquipmentGroupEurolistEntity> {
	private validators: IValidationFunctions<IEquipmentGroupEurolistEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IEquipmentGroupEurolistEntity>> = PlatformSchemaService<IEquipmentGroupEurolistEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Resource.EquipmentGroup', typeName: 'EquipmentGroupEurolistDto'}).then(
			function(scheme) {
				self.validators = new ValidationServiceFactory<IEquipmentGroupEurolistEntity>().provideValidationFunctionsFromScheme(scheme, self);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IEquipmentGroupEurolistEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEquipmentGroupEurolistEntity> {
		return inject(EquipmentGroupEurolistDataService);
	}
}