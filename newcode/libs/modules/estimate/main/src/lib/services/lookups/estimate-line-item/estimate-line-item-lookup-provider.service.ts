/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN, IEstimateLineItemLookupProvider, IEstimateMainLineItemLookupDialogEntity } from '@libs/basics/interfaces';
import { IIdentificationData, LazyInjectable } from '@libs/platform/common';
import {
	createLookup,
	FieldType,
	ILookupServerSideFilter,
	TypedConcreteFieldOverload
} from '@libs/ui/common';
import { EstimateLineItemLookupService } from './estimate-line-item-lookup-dialog.service';
import { Observable } from 'rxjs';

/**
 * Provides estimate lineitem lookup
 */
@LazyInjectable({
	token: ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
  providedIn: 'root'
})
export class EstimateLineItemLookupProviderService implements IEstimateLineItemLookupProvider {

	private readonly lineItemLookup = inject(EstimateLineItemLookupService);
	/**
	 * Generates lookup
	 *
	 * @returns The lookup field overload.
	 */
	public GenerateEstimateLineItemLookup<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
            lookupOptions: createLookup({
                dataServiceToken: EstimateLineItemLookupService
            })
		};
	}

	/**
	 * Generates lookup
	 *
	 * @returns The lookup field overload.
	 */
	public GenerateEstimateLineItemLookupWithServerSideFilter<T extends object>( serverSideFilter: ILookupServerSideFilter<IEstimateMainLineItemLookupDialogEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
            lookupOptions: createLookup({
                dataServiceToken: EstimateLineItemLookupService,
				serverSideFilter: serverSideFilter
			})
		};
	}

	/**
	 * 
	 * @param key 
	 * @returns The lookup field overload.
	 */
	public GetItemByKey(key: IIdentificationData): Observable<IEstimateMainLineItemLookupDialogEntity> {
		return this.lineItemLookup.getItemByKey(key);
	}
}
