/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IProjectComplete, ISchedulingCalendarEntity, ISchedulingCalendarComplete, IProjectCalendarEntity } from '@libs/project/interfaces';
import { ProjectCalendarDataService } from './project-calendar-data.service';

@Injectable({
	providedIn: 'root'
})

export class ProjectSchedulingCalendarDataService extends DataServiceFlatNode<ISchedulingCalendarEntity, ISchedulingCalendarComplete, IProjectCalendarEntity, IProjectComplete> {
	public constructor(projectCalendarDataService:ProjectCalendarDataService) {
	const options: IDataServiceOptions<ISchedulingCalendarEntity> = {
		apiUrl: 'scheduling/calendar',
		readInfo: <IDataServiceEndPointOptions>{
			endPoint: 'list',
			usePost: true,
			prepareParam: () => {
				const selection = projectCalendarDataService.getSelection()[0];
				return { Id: selection.CalendarFk};
			}
		},
		deleteInfo: <IDataServiceEndPointOptions>{
			endPoint: 'multidelete',
		},
		roleInfo: <IDataServiceChildRoleOptions<ISchedulingCalendarEntity, IProjectCalendarEntity, IProjectComplete>>{
			role: ServiceRole.Node,
			itemName: 'Calendars',
			parent: projectCalendarDataService
		},
	};
		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}
}










