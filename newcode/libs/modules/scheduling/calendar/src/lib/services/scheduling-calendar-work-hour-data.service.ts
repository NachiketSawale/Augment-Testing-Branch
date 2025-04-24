/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { SchedulingCalendarDataService } from './scheduling-calendar-data.service';
import { ISchedulingCalendarWorkHourEntity } from '@libs/scheduling/interfaces';
import { SchedulingCalendarComplete } from '@libs/scheduling/interfaces';
import { CommonWorkHourDataService } from '@libs/scheduling/shared';

@Injectable({ providedIn: 'root' })
export class SchedulingCalendarWorkHourDataService extends CommonWorkHourDataService<
	SchedulingCalendarDataService,
	ISchedulingCalendarWorkHourEntity,
	SchedulingCalendarComplete
	> {
	protected constructor(schedulingCalendarDataService: SchedulingCalendarDataService) {
		super(
			schedulingCalendarDataService
		);
	}
	public override registerModificationsToParentUpdate(parentUpdate: SchedulingCalendarComplete, modified: ISchedulingCalendarWorkHourEntity[], deleted: ISchedulingCalendarWorkHourEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.WorkhourToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.WorkhourToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: SchedulingCalendarComplete): ISchedulingCalendarWorkHourEntity[] {
		if (complete && complete.WorkhourToSave) {
			return complete.WorkhourToSave;
		}
		return [];
	}

}