/*
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData, LazyInjectionToken } from '@libs/platform/common';
import { ILookupServerSideFilter, TypedConcreteFieldOverload } from '@libs/ui/common';
import { Observable } from 'rxjs';
import { IEstimateMainLineItemLookupDialogEntity } from './estimate-line-item-lookup.interface';

/**
 * Provides estimate lineitem  lookup
 */
export interface IEstimateLineItemLookupProvider{

	/**
	 * Generates a lookup field
	 *
	 * @returns The lookup field overload.
	 */
	GenerateEstimateLineItemLookup<T extends object>(): TypedConcreteFieldOverload<T>;

	/**
	 * Generates a lookup field with server side filter.
	 *
	 * @returns The lookup field overload.
	 */
	GenerateEstimateLineItemLookupWithServerSideFilter<T extends object>(serverSideFilter: ILookupServerSideFilter<IEstimateMainLineItemLookupDialogEntity, T>): TypedConcreteFieldOverload<T>;
	
	/**
	 * Retrieves an item by its key.
	 *
	 * @param key - The identification data of the item.
	 * @returns An observable that emits the item.
	 */
	GetItemByKey(key: IIdentificationData): Observable<IEstimateMainLineItemLookupDialogEntity>;
}

/**
 * A lazy injection to retrieve lookup field for estimate line item
 */
export const ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IEstimateLineItemLookupProvider>('estimate.main.lineItemLookupProvider');
