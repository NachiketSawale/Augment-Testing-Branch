/*
 * Copyright(c) RIB Software GmbH
 */

import {ILookupInputSelectFieldOverload, ILookupOptions} from '@libs/ui/common';
import {IExchangeRateLookupEntity} from '../entities/exchange-rate-lookup-entity.interface';
import {LazyInjectionToken} from '@libs/platform/common';

export interface IExchangeRateInputLookupOptions<T extends object> {
	lookupOptions?: Partial<ILookupOptions<IExchangeRateLookupEntity, T>>;
}

export interface IExchangeRateInputLookupProvider {
	generateExchangeRateInputLookup<T extends object>(options?: IExchangeRateInputLookupOptions<T>): ILookupInputSelectFieldOverload<T>;
}

export const PROCUREMENT_SHARED_EXCHANGE_RATE_INPUT_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IExchangeRateInputLookupProvider>('procurement.shared.IExchangeRateInputLookupProvider');