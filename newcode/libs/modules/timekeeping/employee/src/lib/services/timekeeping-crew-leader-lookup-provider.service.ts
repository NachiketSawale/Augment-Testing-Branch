/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';
import { LazyInjectable } from '@libs/platform/common';
import { CREW_LEADER_LOOKUP_PROVIDER_TOKEN, ITimekeepingCrewLeaderLookupOptions, ITimekeepingCrewLeaderLookupProvider } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeCrewLeaderLookupService } from '@libs/timekeeping/shared';


/**
 * Provides timekeeping crew leader lookups.
 */
@LazyInjectable({
	token: CREW_LEADER_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection:true
})

@Injectable({
	providedIn: 'root'
})
export class TimekeepingCrewLeaderLookupProvider implements ITimekeepingCrewLeaderLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a crew leader lookup.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateCrewLeaderLookup<T extends object>(options: ITimekeepingCrewLeaderLookupOptions): TypedConcreteFieldOverload<T> {

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: TimekeepingEmployeeCrewLeaderLookupService
			}),
			additionalFields:[
				{
					displayMember: 'Code',
					label: {
						key: options.preloadTranslation + 'CrewLeaderCode',
					},
					column: true,
					singleRow: true
				}
			]
		};
	}
}
