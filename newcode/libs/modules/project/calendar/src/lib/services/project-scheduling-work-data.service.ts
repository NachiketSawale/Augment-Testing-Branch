/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ProjectSchedulingCalendarDataService } from './project-scheduling-calendar-data.service';
import { CommonWorkHourDataService } from '@libs/scheduling/shared';
import { ISchedulingWorkEntity } from '@libs/project/interfaces';
import { SchedulingCalendarComplete } from '@libs/scheduling/interfaces';

@Injectable({ providedIn: 'root' })
export class ProjectSchedulingWorkDataService extends CommonWorkHourDataService<
	ProjectSchedulingCalendarDataService,
	ISchedulingWorkEntity,
	SchedulingCalendarComplete
	> {
	public constructor(projectSchedulingCalendarDataService: ProjectSchedulingCalendarDataService) {
		super(
			projectSchedulingCalendarDataService
		);
	}
}
