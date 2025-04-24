/*
 * Copyright(c) RIB Software GmbH
 */

import {
	ESTIMATE_BOQ_ITEM_LOOKUP_PROVIDER_TOKEN,
	IEstimateBoqItemLookupProvider
} from '@libs/basics/interfaces';
import { createLookup, FieldType,TypedConcreteFieldOverload } from '@libs/ui/common';
import { EstimateMainBoqItemLookupService } from '../estimate-boq/estimate-main-boq-item-lookup.service';
import {LazyInjectable } from '@libs/platform/common';
import { Injectable } from '@angular/core';
@Injectable({
	providedIn: 'root'
})
@LazyInjectable({
	token: ESTIMATE_BOQ_ITEM_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
export class EstimateMainBoqItemLookupProviderService implements IEstimateBoqItemLookupProvider{

	public GenerateEstimateBoQItemLookup<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: EstimateMainBoqItemLookupService,
			})
		};
	}
}