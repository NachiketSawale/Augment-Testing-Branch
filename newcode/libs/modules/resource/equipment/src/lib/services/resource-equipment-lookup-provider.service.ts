import { createLookup, FieldType, ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';
import {
	ICertificatedPlantEntity, IResourceEquipmentLookupProvider, RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN,
} from '@libs/resource/interfaces';

import { ResourceEquipmentLookupProviderGeneratedService } from './generated/resource-equipment-lookup-provider-generated.service';
import { LazyInjectable } from '@libs/platform/common';
import { Injectable } from '@angular/core';
import { ResourceEquipmentPlantLookupService } from './resource-equipment-plant-lookup.service';

@LazyInjectable({
	token: RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})

export class ResourceEquipmentLookupProvider extends ResourceEquipmentLookupProviderGeneratedService implements IResourceEquipmentLookupProvider{
	public providePlantLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, ICertificatedPlantEntity>({
				dataServiceToken: ResourceEquipmentPlantLookupService,
				showClearButton: !!options?.showClearButton,
			})
		};
	}
}