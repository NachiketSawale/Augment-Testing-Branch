/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { SchedulingCalendarDataService } from './scheduling-calendar-data.service';
import { ISchedulingCalendarExceptionDayEntity ,SchedulingCalendarComplete, ISchedulingCalendarEntity} from '@libs/scheduling/interfaces';
export const SCHEDULING_CALENDAR_EXCEPTION_DAY_DATA_TOKEN = new InjectionToken<SchedulingCalendarExceptionDayDataService>('schedulingCalendarExceptionDayDataToken');

@Injectable({
	providedIn: 'root',
})
export class SchedulingCalendarExceptionDayDataService extends DataServiceFlatLeaf<ISchedulingCalendarExceptionDayEntity,ISchedulingCalendarEntity, SchedulingCalendarComplete> {
	public constructor(schedulingCalendarDataService:SchedulingCalendarDataService) {
		const options: IDataServiceOptions<ISchedulingCalendarExceptionDayEntity> = {
			apiUrl: 'scheduling/calendar/exceptionday',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId : ident.pKey1};
				}
			},
			createInfo:<IDataServiceEndPointOptions>{
				prepareParam: ident => {
					return { id: 0, pKey1 : ident.pKey1};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<ISchedulingCalendarExceptionDayEntity,ISchedulingCalendarEntity, SchedulingCalendarComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'ExceptionDays',
				parent: schedulingCalendarDataService
			}
		};

		super(options);
	}
	public override registerByMethod(): boolean {
		return true;
	}


	public override registerModificationsToParentUpdate(parentUpdate: SchedulingCalendarComplete, modified: ISchedulingCalendarExceptionDayEntity[], deleted: ISchedulingCalendarExceptionDayEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.ExceptionDaysToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.ExceptionDaysToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: SchedulingCalendarComplete): ISchedulingCalendarExceptionDayEntity[] {
		if (complete && complete.ExceptionDaysToSave) {
			return complete.ExceptionDaysToSave;
		}

		return [];
	}
}
