/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ProjectSchedulingCalendarDataService } from './project-scheduling-calendar-data.service';
import { ISchedulingCalendarWeekDayEntity } from '@libs/scheduling/interfaces';
import { SchedulingCalendarComplete } from '@libs/scheduling/interfaces';
import { CommonWeekDayDataService } from '@libs/scheduling/shared';

@Injectable({ providedIn: 'root' })
export class ProjectSchedulingWeekDayDataService extends CommonWeekDayDataService<
	ProjectSchedulingCalendarDataService,
	ISchedulingCalendarWeekDayEntity,
	SchedulingCalendarComplete
	> {
	public constructor(projectSchedulingCalendarDataService: ProjectSchedulingCalendarDataService) {
		super(
			projectSchedulingCalendarDataService
		);
	}
}

