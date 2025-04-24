/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { EQUIPMENT_GROUP_LOOKUP_PROVIDER_TOKEN, IEquipmentGroupEntity, IEquipmentGroupLookupProvider } from '@libs/resource/interfaces';
import { createLookup, FieldType, ILookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';
import { ResourceEquipmentGroupLookupService } from '@libs/resource/shared';

@LazyInjectable({
	token: EQUIPMENT_GROUP_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class EquipmentGroupLookupProviderService implements IEquipmentGroupLookupProvider {
	public generateEquipmentGroupLookup<T extends object>(options?: ILookupOptions<IEquipmentGroupEntity, T> | undefined): TypedConcreteFieldOverload<T>{
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ResourceEquipmentGroupLookupService,
				...options
			})
		};
	}

	public generateEquipmentGroupReadOnlyLookup<T extends object>(options?: ILookupOptions<IEquipmentGroupEntity, T> | undefined): TypedConcreteFieldOverload<T>{
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup({
				dataServiceToken: ResourceEquipmentGroupLookupService,
				showClearButton: false,
				...options
			})
		};
	}
}