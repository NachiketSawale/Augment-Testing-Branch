/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';
import { LazyInjectionToken } from '@libs/platform/common';

export interface IBasicsCurrencyLookupProvider {
	/**
	 * Generates a lookup field overload definition to pick a basics currency.
	 *
	 * @returns The lookup field overload.
	 */
	provideCurrencyLookupOverload<T extends object>(options: ICommonLookupOptions): TypedConcreteFieldOverload<T>;

	/**
	 * Generates a lookup field overload definition to pick a basics currency.
	 *
	 * @returns The lookup field overload.
	 */
	provideCurrencyReadonlyLookupOverload<T extends object>(): TypedConcreteFieldOverload<T>;
}
export const BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IBasicsCurrencyLookupProvider>('basics.currency.lookupProvider');