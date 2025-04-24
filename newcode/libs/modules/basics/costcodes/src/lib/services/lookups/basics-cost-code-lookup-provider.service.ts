/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import {
	createLookup,
	FieldType,
	TypedConcreteFieldOverload
} from '@libs/ui/common';
import { BASICS_COST_CODES_LOOKUP_PROVIDER_TOKEN, IBasicsCostCodeLookupProvider } from '@libs/basics/interfaces';
import { BasicsSharedCostCodeLookupService } from '@libs/basics/shared';

/**
 * Provides basic cost code lookup
 */
@LazyInjectable({
	token: BASICS_COST_CODES_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodeLookupProviderService implements IBasicsCostCodeLookupProvider {

	/**
	 * Generates lookup
	 *
	 * @returns The lookup field overload.
	 */
	public GenerateBasicsCostCodeLookup<T extends object>(readonly = false): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
            lookupOptions: createLookup({
                dataServiceToken: BasicsSharedCostCodeLookupService,
                showClearButton: true,
				readonly: readonly
            })
		};
	}
}
