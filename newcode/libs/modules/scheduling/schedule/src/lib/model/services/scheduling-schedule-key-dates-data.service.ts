/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IIdentificationData } from '@libs/platform/common';
import { IScheduleEntity } from '@libs/scheduling/interfaces';
import { IProjectComplete } from '@libs/project/interfaces';
import { SchedulingScheduleDataService } from './scheduling-schedule-data.service';
import { ITimelineEntity } from '../entities/timeline-entity.interface';
@Injectable({
	providedIn: 'root'
})

export class SchedulingScheduleKeyDatesDataService extends DataServiceFlatLeaf<ITimelineEntity,IScheduleEntity, IProjectComplete>{

	public constructor() {
		const options: IDataServiceOptions<ITimelineEntity>  = {
			apiUrl: 'scheduling/schedule/timeline',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident: IIdentificationData) => {
					return {mainItemId: ident.pKey1!};
				},
			},
			roleInfo: <IDataServiceRoleOptions<ITimelineEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'Timelines',
				parent: inject(SchedulingScheduleDataService) ,
			},

		};

		super(options);
	}
}