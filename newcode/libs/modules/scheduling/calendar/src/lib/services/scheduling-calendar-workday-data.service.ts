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
import { SchedulingCalendarComplete,ISchedulingCalendarEntity,ISchedulingCalendarWorkDayEntity } from '@libs/scheduling/interfaces';

export const SCHEDULING_CALENDAR_WORK_DAY_DATA_TOKEN = new InjectionToken<SchedulingCalendarWorkDayDataService>('schedulingCalendarWorkDayDataToken');

@Injectable({
	providedIn: 'root',
})
export class SchedulingCalendarWorkDayDataService extends DataServiceFlatLeaf<ISchedulingCalendarWorkDayEntity,ISchedulingCalendarEntity, SchedulingCalendarComplete> {
	public constructor(schedulingCalendarDataService:SchedulingCalendarDataService) {
		const options: IDataServiceOptions<ISchedulingCalendarWorkDayEntity> = {
			apiUrl: 'scheduling/calendar/workday',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId : ident.pKey1};
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: ident => {
					return { mainItemId : ident.pKey1};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<ISchedulingCalendarWorkDayEntity,ISchedulingCalendarEntity, SchedulingCalendarComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'Work',
				parent: schedulingCalendarDataService
			}
		};

		super(options);
	}
	public override registerByMethod(): boolean {
		return true;
	}


	public override registerModificationsToParentUpdate(parentUpdate: SchedulingCalendarComplete, modified: ISchedulingCalendarWorkDayEntity[], deleted: ISchedulingCalendarWorkDayEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.WorkdaysToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.WorkdaysToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: SchedulingCalendarComplete): ISchedulingCalendarWorkDayEntity[] {
		if (complete && complete.WorkdaysToSave) {
			return complete.WorkdaysToSave;
		}

		return [];
	}
}
