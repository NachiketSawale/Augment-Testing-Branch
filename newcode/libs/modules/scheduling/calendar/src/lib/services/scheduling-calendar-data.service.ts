/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ISchedulingCalendarEntity,SchedulingCalendarComplete } from '@libs/scheduling/interfaces';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';

export const SCHEDULING_CALENDAR_DATA_TOKEN = new InjectionToken<SchedulingCalendarDataService>('schedulingCalendarDataToken');

@Injectable({
	providedIn: 'root',
})
export class SchedulingCalendarDataService extends DataServiceFlatRoot<ISchedulingCalendarEntity, SchedulingCalendarComplete> {
	public constructor() {
		const options: IDataServiceOptions<ISchedulingCalendarEntity> = {
			apiUrl: 'scheduling/calendar',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<ISchedulingCalendarEntity>>{
				role: ServiceRole.Root,
				itemName: 'Calendar'

			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: ISchedulingCalendarEntity | null): SchedulingCalendarComplete {
		const complete = new SchedulingCalendarComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Calendars = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: SchedulingCalendarComplete) {
		if (complete.Calendars === null) {
			complete.Calendars = [];
		}

		return complete.Calendars;
	}

}
