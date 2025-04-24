/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';
import { IScheduleEntity, ISchedulingScheduleLookupOptions, ISchedulingScheduleLookupProvider, SCHEDULE_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { LazyInjectable } from '@libs/platform/common';
import { SchedulingScheduleLookup } from '@libs/scheduling/shared';

/**
 * Provides scheduling schedule lookups.
 */
@LazyInjectable({
	token:SCHEDULE_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection:true
})

@Injectable({
	providedIn: 'root'
})
export class SchedulingScheduleLookupProviderService implements ISchedulingScheduleLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a schedule lookup.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateScheduleLookup<T extends object>(options?: ISchedulingScheduleLookupOptions): TypedConcreteFieldOverload<T> {

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IScheduleEntity>({
				dataServiceToken: SchedulingScheduleLookup,
				readonly: options?.readonly ?? false
			})
		};
	}
}
