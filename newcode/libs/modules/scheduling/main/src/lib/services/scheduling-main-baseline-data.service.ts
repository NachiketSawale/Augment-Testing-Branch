/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions,} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IBaselineEntity, IActivityEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainDataService } from './scheduling-main-data.service';

@Injectable({
	providedIn: 'root'
})

export class SchedulingMainBaselineDataService extends DataServiceFlatLeaf<IBaselineEntity,
	IActivityEntity, ActivityComplete> {

	public constructor(schedulingMainDataService : SchedulingMainDataService) {
		const options: IDataServiceOptions<IBaselineEntity> = {
			apiUrl: 'scheduling/main/baseline',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyschedule',
				usePost: true,
				prepareParam: ident => {
					const selection = schedulingMainDataService.getSelection()[0];
					const readdata = { filter: [] as (number | string)[] };
					if (selection && selection.ScheduleFk) {
						readdata.filter.push(selection.ScheduleFk);
					}
					return readdata;
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IBaselineEntity,
				IBaselineEntity, ActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Baselines',
				parent: schedulingMainDataService
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			}
		};

		super(options);
	}
}
