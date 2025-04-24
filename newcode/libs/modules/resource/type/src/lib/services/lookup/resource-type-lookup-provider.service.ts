/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceTypeLookupProviderGeneratedService } from './generated/resource-type-lookup-provider-generated.service';
import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IResourceTypeEntity, IResourceTypeLookupProvider, RESOURCE_TYPE_LOOKUP_PROVIDER_TOKEN } from '@libs/resource/interfaces';
import { createLookup, FieldType, ILookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';
import { ResourceTypeLookupService } from '@libs/resource/shared';

@LazyInjectable({
	token: RESOURCE_TYPE_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class ResourceTypeLookupProviderService extends ResourceTypeLookupProviderGeneratedService implements IResourceTypeLookupProvider {

	public generateResourceTypeLookup<T extends object>(options?: ILookupOptions<IResourceTypeEntity, T> | undefined): TypedConcreteFieldOverload<T>{
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ResourceTypeLookupService,
				...options,
			}),
		};
	}
}