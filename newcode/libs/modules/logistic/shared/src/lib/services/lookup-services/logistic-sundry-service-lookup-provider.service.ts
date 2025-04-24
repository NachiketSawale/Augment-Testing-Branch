/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { LogisticSundryServiceLookupService } from './index';
import { ILogisticSundryServiceLookupProvider, LOGISTIC_SUNDRY_SERVICE_LOOKUP_PROVIDER_TOKEN } from '../../model/lookup/logistic-shared-lookup-overload.interface';
import { LogisticSundryServiceLookupProviderGenerated } from './logistic-sundry-service-lookup-provider.generated';


@LazyInjectable({
	token: LOGISTIC_SUNDRY_SERVICE_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})

export class LogisticSundryServiceLookupProviderService extends LogisticSundryServiceLookupProviderGenerated implements ILogisticSundryServiceLookupProvider{
	public provideLogisticSundryServiceLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: false,
			lookupOptions: createLookup({
				dataServiceToken: LogisticSundryServiceLookupService,
				showClearButton: !!options?.showClearButton,
			})
		};
	}
}
