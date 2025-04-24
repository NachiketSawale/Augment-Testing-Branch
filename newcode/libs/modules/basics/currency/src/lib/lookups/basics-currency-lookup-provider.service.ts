/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IBasicsCurrencyLookupProvider, BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN, IBasicsCurrencyEntity } from '@libs/basics/interfaces';
import { createLookup, FieldType, ICommonLookupOptions, TypedConcreteFieldOverload } from "@libs/ui/common";
import { BasicsSharedLookupOverloadProvider, IBasicsCurrencyLookupService } from '@libs/basics/shared';
import * as entities from "@libs/basics/interfaces";
import { BasicsCurrencyLookupService } from './basics-currency-lookup.service';

@LazyInjectable({
	token: BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class BasicsCurrencyLookupProviderService implements IBasicsCurrencyLookupProvider {
	public provideCurrencyLookupOverload<T extends object>(options: ICommonLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: false,
			lookupOptions:  createLookup<T, entities.IBasicsCurrencyEntity>({
				dataServiceToken: BasicsCurrencyLookupService,
				showClearButton: options.showClearButton
			})
		};
	}

	public provideCurrencyReadonlyLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCurrencyEntity>({
				dataServiceToken: BasicsCurrencyLookupService,
				showClearButton: false
			})
		};
	}
}