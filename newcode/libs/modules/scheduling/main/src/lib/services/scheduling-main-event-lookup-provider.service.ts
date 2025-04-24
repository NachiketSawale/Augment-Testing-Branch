/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';
import { LazyInjectable } from '@libs/platform/common';
import { IEventEntity, ISchedulingMainEventLookupOptions, ISchedulingMainEventLookupProvider, SCHEDULING_MAIN_EVENT_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { SchedulingMainEventLookupService } from '@libs/scheduling/shared';


/**
 * Provides scheduling main event lookups.
 */
@LazyInjectable({
	token: SCHEDULING_MAIN_EVENT_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection:true
})

@Injectable({
	providedIn: 'root'
})
export class SchedulingMainEventLookupProvider implements ISchedulingMainEventLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick an event lookup.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateSchedulingMainEventLookup<T extends object>(options: ISchedulingMainEventLookupOptions): TypedConcreteFieldOverload<T> {

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IEventEntity>({
				dataServiceToken: SchedulingMainEventLookupService,
				showClearButton: options?.showClearButton ? options?.showClearButton : false
			}),
			additionalFields:[
				{
					displayMember: 'Date',
					label: {
						key: options.preloadTranslation + 'EventDate',
					},
					column: true,
					singleRow: true
				},
				//TODO get Values of lookups from EventTypeFk, ActivityFk
				{
					displayMember: 'EventTypeFk',
					label: {
						key: options.preloadTranslation + 'EventType',
					},
					column: true,
					singleRow: true
				},
				{
					displayMember: 'ActivityFk',
					label: {
						key: options.preloadTranslation + 'EventActivity',
					},
					column: true,
					singleRow: true
				}
			]
		};
	}
}
