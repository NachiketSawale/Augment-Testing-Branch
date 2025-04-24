/*
 * Copyright(c) RIB Software GmbH
 */
import {TypedConcreteFieldOverload } from '@libs/ui/common';
import {LazyInjectionToken } from '@libs/platform/common';

export interface IEstimateBoqItemLookupProvider {
	/**
	 * Generates a lookup field
	 *
	 * @returns The lookup field overload.
	 */
	GenerateEstimateBoQItemLookup<T extends object>(): TypedConcreteFieldOverload<T>;

}
/**
 * A lazy injection to retrieve lookup field for estimate boq item
 */
export const ESTIMATE_BOQ_ITEM_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IEstimateBoqItemLookupProvider>('estimate.main.boqItemLookupProvider');
