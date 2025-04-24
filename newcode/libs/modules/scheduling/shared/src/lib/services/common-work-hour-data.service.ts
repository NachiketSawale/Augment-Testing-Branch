/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, Inject } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions, DataServiceFlatNode, DataServiceFlatRoot } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IProjectCalendarEntity, IProjectComplete, ISchedulingCalendarComplete } from '@libs/project/interfaces';
import { ISchedulingCalendarEntity, SchedulingCalendarComplete } from '@libs/scheduling/interfaces';

@Injectable({ providedIn: 'root' })
export class CommonWorkHourDataService<
	TParent extends DataServiceFlatNode<ISchedulingCalendarEntity, ISchedulingCalendarComplete, IProjectCalendarEntity, IProjectComplete> | DataServiceFlatRoot<ISchedulingCalendarEntity, SchedulingCalendarComplete>,
	TEntity extends object,
	TComplete extends object
	> extends DataServiceFlatLeaf<TEntity, ISchedulingCalendarEntity, TComplete> {
	public constructor(
		@Inject('SCHEDULE_CALENDAR_PARENT_SERVICE') private parentService: TParent,
	) {
		const options: IDataServiceOptions<TEntity> = {
			apiUrl: 'scheduling/calendar/workhour',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: () => {
					const selection = parentService.getSelection()[0];
					return { mainItemId: selection.Id };
				},
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<TEntity, ISchedulingCalendarEntity, TComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Work',
				parent: parentService,
			},
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}
}