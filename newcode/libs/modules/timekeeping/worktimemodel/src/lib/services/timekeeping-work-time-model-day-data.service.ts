/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';



import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';





import { IWorkTimeModelDayEntity } from '../model/entities/work-time-model-day-entity.interface';
import { IWorkTimeModelEntity } from '../model/entities/work-time-model-entity.interface';
import { TimekeepingWorkTimeModelComplete } from '../model/timekeeping-work-time-model-complete.class';
import { TimekeepingWorkTimeModelDataService } from './timekeeping-work-time-model-data.service';



@Injectable({
	providedIn: 'root'
})





export class TimekeepingWorkTimeModelDayDataService extends DataServiceFlatLeaf<IWorkTimeModelDayEntity,IWorkTimeModelEntity, TimekeepingWorkTimeModelComplete >{

	public constructor(timekeepingWorkTimeModelDataService :TimekeepingWorkTimeModelDataService) {
		const options: IDataServiceOptions<IWorkTimeModelDayEntity>  = {
			apiUrl: 'timekeeping/worktimemodel/day',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IWorkTimeModelDayEntity,IWorkTimeModelEntity, TimekeepingWorkTimeModelComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'WorkTimeModelDay',
				parent: timekeepingWorkTimeModelDataService,
			},


		};

		super(options);
	}

	public override isParentFn(parentKey: IWorkTimeModelEntity, entity: IWorkTimeModelDayEntity): boolean {
		return entity.WorkingTimeModelFk == parentKey.Id;
	}

}



