/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';
import { LazyInjectable } from '@libs/platform/common';
import { ITimekeepingGroupLookupOptions, ITimekeepingGroupLookupProvider, TIMEKEEPING_GROUP_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';
import { TimeKeepingGroupLookupService } from '@libs/timekeeping/shared';


/**
 * Provides timekeeping time symbol lookups.
 */
@LazyInjectable({
	token: TIMEKEEPING_GROUP_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection:true
})

@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimekeepingGroupLookupProviderService implements ITimekeepingGroupLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a time symbol lookup.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateTimekeepingGroupLookup<T extends object>(options: ITimekeepingGroupLookupOptions): TypedConcreteFieldOverload<T> {

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: TimeKeepingGroupLookupService,
			})
		};
	}
}
