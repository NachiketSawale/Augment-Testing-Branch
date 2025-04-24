/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IActivityBaselineCmpVEntity, IActivityEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainDataService } from './scheduling-main-data.service';

@Injectable({
	providedIn: 'root'
})
export class SchedulingMainActivityBaselineComparison extends DataServiceFlatNode<IActivityBaselineCmpVEntity, ActivityComplete, IActivityEntity, ActivityComplete>{

	public constructor(schedulingMainDataService : SchedulingMainDataService) {
		const options: IDataServiceOptions<IActivityBaselineCmpVEntity>  = {
			apiUrl: 'scheduling/main/activitybaselinecmp',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				prepareParam: ident => {
					return { mainItemId: ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IActivityBaselineCmpVEntity, IActivityEntity, ActivityComplete>>{
				role: ServiceRole.Node,
				itemName: 'ActivityBaselineCmp',
				parent: schedulingMainDataService,
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			}
		};
		super(options);
	}
}