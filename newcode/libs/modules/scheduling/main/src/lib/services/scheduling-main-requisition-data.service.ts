/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions,} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IActivityEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainDataService } from './scheduling-main-data.service';
import { IRequisitionEntity } from '@libs/resource/interfaces';
@Injectable({
	providedIn: 'root'
})

export class SchedulingMainRequisitionDataService extends DataServiceFlatLeaf<IRequisitionEntity,
	IActivityEntity, ActivityComplete> {

	public constructor(schedulingMainDataService : SchedulingMainDataService) {
		const options: IDataServiceOptions<IRequisitionEntity> = {
			apiUrl: 'resource/requisition',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'requiredby',
				usePost: true,
				prepareParam: ident => {
					const selection = schedulingMainDataService.getSelection()[0];
					return { Id: 1, PKey1: selection.Id };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IRequisitionEntity,
				IActivityEntity, ActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Requisitions',
				parent: schedulingMainDataService
			}
		};
		super(options);
	}
}
