/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { ISchedulingExceptionDayEntity, IProjectComplete, IProjectCalendarEntity } from '@libs/project/interfaces';
import { ProjectCalendarDataService } from '../services/project-calendar-data.service';


@Injectable({
	providedIn: 'root',
})
export class ProjectSchedulingExceptionDayDataService extends DataServiceFlatLeaf<ISchedulingExceptionDayEntity, IProjectCalendarEntity, IProjectComplete> {
	public constructor(projectCalendarDataService:ProjectCalendarDataService) {
		const options: IDataServiceOptions<ISchedulingExceptionDayEntity> = {
			apiUrl: 'project/calendar/exceptionday',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: () => {
					const selection = projectCalendarDataService.getSelection()[0];
					return { PKey1: selection.Id};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<ISchedulingExceptionDayEntity, IProjectCalendarEntity, IProjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ExceptionDays',
				parent: projectCalendarDataService,
			},
		};
		super(options);
	}
	public override registerByMethod(): boolean {
		return true;
	}


}
