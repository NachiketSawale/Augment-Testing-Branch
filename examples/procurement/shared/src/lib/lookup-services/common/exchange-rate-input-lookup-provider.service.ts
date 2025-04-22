/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IExchangeRateInputLookupOptions, IExchangeRateInputLookupProvider, PROCUREMENT_SHARED_EXCHANGE_RATE_INPUT_LOOKUP_PROVIDER_TOKEN } from '@libs/procurement/interfaces';
import { createLookup, FieldType, ILookupInputSelectFieldOverload } from '@libs/ui/common';
import { ProcurementSharedExchangeRateInputLookupService } from './exchange-rate-input-lookup.service';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable({
	token: PROCUREMENT_SHARED_EXCHANGE_RATE_INPUT_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true,
})
export class ProcurementSharedExchangeRateInputLookupProviderService implements IExchangeRateInputLookupProvider {
	public generateExchangeRateInputLookup<T extends object>(options?: IExchangeRateInputLookupOptions<T>): ILookupInputSelectFieldOverload<T> {
		return {
			type: FieldType.LookupInputSelect,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementSharedExchangeRateInputLookupService,
				...options?.lookupOptions,
			}),
		};
	}
}