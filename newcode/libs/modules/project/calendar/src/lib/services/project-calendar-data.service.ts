/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, ServiceRole } from '@libs/platform/data-access';
import { IProjectCalendarComplete } from '../model/entities/project-calendar-complete.interface';
import { IProjectCalendarParentComplete } from '../model/entities/project-calendar-parent-complete.interface';
import { IProjectCalendarEntity, IProjectEntity } from '@libs/project/interfaces';
import { PROJECT_SERVICE_TOKEN } from '@libs/project/interfaces';

/**
 * Material group attribute data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProjectCalendarDataService extends DataServiceFlatNode<IProjectCalendarEntity, IProjectCalendarComplete, IProjectEntity, IProjectCalendarParentComplete> {
	public constructor() {
		super({
			apiUrl: 'project/calendar',
			readInfo:<IDataServiceEndPointOptions> {
				endPoint: 'listbyproject',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectCalendarEntity, IProjectEntity, IProjectCalendarParentComplete>>{
				role: ServiceRole.Node,
				itemName: 'ProjectCalendar',
				parent: PROJECT_SERVICE_TOKEN,
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: ident =>  {
					return {
						MainItemID: ident.pKey1
					};
				}
			},
		});
	}
}