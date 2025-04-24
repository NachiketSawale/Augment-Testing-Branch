/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { SchedulingCalendarDataService } from './scheduling-calendar-data.service';
import { ISchedulingCalendarWeekDayEntity, SchedulingCalendarComplete } from '@libs/scheduling/interfaces';
import { CommonWeekDayDataService } from '@libs/scheduling/shared';

@Injectable({ providedIn: 'root' })
export class SchedulingCalendarWeekDayDataService extends CommonWeekDayDataService<
	SchedulingCalendarDataService,
	ISchedulingCalendarWeekDayEntity,
	SchedulingCalendarComplete
	> {
	protected constructor(schedulingCalendarDataService: SchedulingCalendarDataService) {
		super(
			schedulingCalendarDataService
		);
	}
		public override registerModificationsToParentUpdate(parentUpdate: SchedulingCalendarComplete, modified: ISchedulingCalendarWeekDayEntity[], deleted: ISchedulingCalendarWeekDayEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.WeekdaysToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.WeekdaysToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: SchedulingCalendarComplete): ISchedulingCalendarWeekDayEntity[] {
		if (complete && complete.WeekdaysToSave) {
			return complete.WeekdaysToSave;
		}
		return [];
	}

}
