/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ISchedulingCalendarWorkHourEntity } from '@libs/scheduling/interfaces';

@Injectable({
	providedIn: 'root'
})
export class SchedulingCalendarLookup<TEntity extends object> extends UiCommonLookupEndpointDataService<ISchedulingCalendarWorkHourEntity, TEntity> {

	public constructor() {
		const endpoint = {httpRead: { route: 'scheduling/calendar/weekday/', endPointRead: 'list' }};
		const config = {
			uuid: 'f3f58b9e9f0243fe8aeddd21adcfee83',
			valueMember: 'Id',
			displayMember: 'AcronymInfo',
			//showGrid:true
		};

		super(endpoint, config);
	}
}