/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';



import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IWorkTimeModelDtlEntity } from '../model/entities/work-time-model-dtl-entity.interface';
import { IWorkTimeModelEntity } from '../model/entities/work-time-model-entity.interface';
import { TimekeepingWorkTimeModelComplete } from '../model/timekeeping-work-time-model-complete.class';
import { TimekeepingWorkTimeModelDataService } from './timekeeping-work-time-model-data.service';




@Injectable({
	providedIn: 'root'
})





export class TimekeepingWorkTimeModelDtlDataService extends DataServiceFlatLeaf<IWorkTimeModelDtlEntity,IWorkTimeModelEntity, TimekeepingWorkTimeModelComplete >{

	public constructor(timekeepingWorkTimeModelDataService :TimekeepingWorkTimeModelDataService) {
		const options: IDataServiceOptions<IWorkTimeModelDtlEntity>  = {
			apiUrl: 'timekeeping/worktimemodel/dtl',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IWorkTimeModelDtlEntity,IWorkTimeModelEntity, TimekeepingWorkTimeModelComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'WorkTimeModelDtl',
				parent: timekeepingWorkTimeModelDataService,
			},

		};

		super(options);
	}

	public override isParentFn(parentKey: IWorkTimeModelEntity, entity: IWorkTimeModelDtlEntity): boolean {
		return entity.WorkingTimeModelFk === parentKey.Id;
	}

}



