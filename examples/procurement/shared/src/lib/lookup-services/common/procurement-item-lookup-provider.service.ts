/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IPrcItemLookupOptions, IPrcItemLookupProvider, PROCUREMENT_ITEM_LOOKUP_PROVIDER_TOKEN } from '@libs/procurement/interfaces';
import { createLookup, FieldType, ILookupFieldOverload } from '@libs/ui/common';
import { ProcurementSharedPrcItemLookupService } from './prc-item-lookup.service';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable({
	token: PROCUREMENT_ITEM_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true,
})
export class ProcurementSharedPrcItemLookupProviderService implements IPrcItemLookupProvider {
	public generateProcurementItemLookup<T extends object>(options?: IPrcItemLookupOptions<T>): ILookupFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementSharedPrcItemLookupService,
				...options?.lookupOptions,
			}),
		};
	}
}