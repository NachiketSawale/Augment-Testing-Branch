/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for timekeeping time symbol lookup.
 */
export interface ITimekeepingTimeSymbolLookupOptions {
	preloadTranslation: string;
	readonly?: boolean;
}

/**
 * Provides time symbol lookups.
 */
export interface ITimekeepingTimeSymbolLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a time symbol.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateTimeSymbolLookup<T extends object>(options: ITimekeepingTimeSymbolLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates time symbol lookup field overloads.
 */
export const TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<ITimekeepingTimeSymbolLookupProvider>('timekeeping.timesymbols.TimeSymbolLookupProvider');
