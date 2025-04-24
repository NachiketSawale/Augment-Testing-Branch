/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EquipmentGroupPricelistDataService } from './equipment-group-pricelist-data.service';
import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IEquipmentGroupPricelistEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})
export class EquipmentGroupPricelistValidationService extends BaseValidationService<IEquipmentGroupPricelistEntity> {
	private validators: IValidationFunctions<IEquipmentGroupPricelistEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IEquipmentGroupPricelistEntity>> = PlatformSchemaService<IEquipmentGroupPricelistEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Resource.EquipmentGroup', typeName: 'EquipmentGroupPricelistDto'}).then(
			function(scheme) {
				self.validators = new ValidationServiceFactory<IEquipmentGroupPricelistEntity>().provideValidationFunctionsFromScheme(scheme, self);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IEquipmentGroupPricelistEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEquipmentGroupPricelistEntity> {
		return inject(EquipmentGroupPricelistDataService);
	}
}