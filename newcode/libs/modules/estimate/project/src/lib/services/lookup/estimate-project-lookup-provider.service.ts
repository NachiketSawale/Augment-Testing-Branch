/*
 * Copyright(c) RIB Software GmbH
 */
import { FieldType, ICommonLookupOptions, TypedConcreteFieldOverload, createLookup } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { ESTIMATE_MAIN_LOOKUP_PROVIDER_TOKEN, IEstHeaderEntity, IEstimateMainLookupProvider } from '@libs/estimate/interfaces';
import { EstimateProjectHeaderLookupService } from './estimate-project-header-lookup.service';



/**
 * Provides estimate project lookup
 */
@LazyInjectable({
	token: ESTIMATE_MAIN_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class EstimatePojectLookupProvider implements IEstimateMainLookupProvider {

	/**
	 * Generates lookup
	 *
	 * @returns The lookup field overload.
	 */

    public provideEstimateMainHeaderLookupLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IEstHeaderEntity>({
				dataServiceToken: EstimateProjectHeaderLookupService,
				showClearButton: !!options?.showClearButton,
			})
		};
	}

}
