/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';
import { LazyInjectable } from '@libs/platform/common';
import { IActivity2ModelObjectEntity, ISchedulingMainActivity2ModelObjectLookupOptions, ISchedulingMainActivity2ModelObjectLookupProvider, SCHEDULING_MAIN_ACTIVITY_2MODEL_OBJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { SchedulingActivity2modelobjectLookup } from '@libs/scheduling/shared';


/**
 * Provides scheduling main activity2model object lookups.
 */
@LazyInjectable({
	token: SCHEDULING_MAIN_ACTIVITY_2MODEL_OBJECT_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection:true
})

@Injectable({
	providedIn: 'root'
})
export class SchedulingMainActivity2ModelObjectLookupProvider implements ISchedulingMainActivity2ModelObjectLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick an activity2model object lookup.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateSchedulingMainActivity2ModelObjectLookup<T extends object>(options?: ISchedulingMainActivity2ModelObjectLookupOptions): TypedConcreteFieldOverload<T> {

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IActivity2ModelObjectEntity>({
				dataServiceToken: SchedulingActivity2modelobjectLookup,
			})
		};
	}
}
