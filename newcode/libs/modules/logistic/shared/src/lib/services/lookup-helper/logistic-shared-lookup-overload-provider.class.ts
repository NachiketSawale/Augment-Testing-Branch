/*
 * Copyright(c) RIB Software GmbH
 */

import {  createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';
import { LogisticSundryServiceGroupLookupService } from '../lookup-services/logistic-sundry-service-group-lookup.service';

export class LogisticSharedLookupOverloadProvider {

	public static provideLogisticSundryGroupReadonlyLookupOverload<T extends object>():TypedConcreteFieldOverload<T>{
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup({
				dataServiceToken: LogisticSundryServiceGroupLookupService,
				showClearButton: false
			})
		};
	}

}