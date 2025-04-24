/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IIdentificationData } from '@libs/platform/common';
import { IScheduleEntity } from '@libs/scheduling/interfaces';
import { IProjectComplete } from '@libs/project/interfaces';
import { SchedulingScheduleDataService } from './scheduling-schedule-data.service';
@Injectable({
	providedIn: 'root'
})

export class SchedulingSubscheduleDataService extends DataServiceFlatLeaf<IScheduleEntity,IScheduleEntity, IProjectComplete>{

	public constructor() {
		const options: IDataServiceOptions<IScheduleEntity>  = {
			apiUrl: 'scheduling/schedule',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listsubschedules',
				usePost: false,
				prepareParam: (ident: IIdentificationData) => {
					return {scheduleId: ident.pKey1!};
				},
			},
			roleInfo: <IDataServiceRoleOptions<IScheduleEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'SubSchedules',
				parent: inject(SchedulingScheduleDataService) ,
			},

		};

		super(options);
	}
}