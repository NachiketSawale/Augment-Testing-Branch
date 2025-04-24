/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';
import { CALENDAR_LOOKUP_PROVIDER_TOKEN, IActivityEntity, ISchedulingCalendarLookupOptions, ISchedulingCalendarLookupProvider } from '@libs/scheduling/interfaces';
import { IEntityContext, LazyInjectable } from '@libs/platform/common';
import { SchedulingCalendarLookupWithoutEndpoint } from './lookup/scheduling-calendar-lookup-without-endpoint.service';


/**
 * Provides scheduling activity lookups.
 */
@LazyInjectable({
	token:CALENDAR_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection:true
})

@Injectable({
	providedIn: 'root'
})
export class SchedulingCalendarLookupProviderService implements ISchedulingCalendarLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick an activity lookup.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateCalendarLookup<T extends object>(options?: ISchedulingCalendarLookupOptions): TypedConcreteFieldOverload<T> {

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IActivityEntity>({
				dataServiceToken: SchedulingCalendarLookupWithoutEndpoint,
				serverSideFilter: {
					key: 'projectCalendar',
					execute(entity: IEntityContext<object>): string | object {
						const tempEntity = entity as unknown as { scheduleFk: number | null | undefined,projectFk: number | null | undefined };
						return { scheduleFk: tempEntity.scheduleFk, projectFk:tempEntity.projectFk };
					}
				},
				gridConfig: {
					uuid: '6b02521vcb304d618a43ff502de1abck',
					columns: [{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Id', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true
					},
						{
							id: 'Description',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: {text: 'Description', key: 'cloud.common.entityDescription'},
							sortable: true,
							visible: true
						},
						{
							id: 'CalendarType',
							model: 'CalendarTypeFk',
							type: FieldType.Integer,
							label: {text: 'Calendar Type', key: ''},
							sortable: true,
							visible: true
						}]
				}
			})
		};
	}
}
