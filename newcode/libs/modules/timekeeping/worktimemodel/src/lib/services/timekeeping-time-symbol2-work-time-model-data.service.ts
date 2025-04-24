/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ITimeSymbol2WorkTimeModelEntity } from '../model/entities/time-symbol-2work-time-model-entity.interface';
import { IWorkTimeModelEntity } from '../model/entities/work-time-model-entity.interface';
import { TimekeepingWorkTimeModelComplete } from '../model/timekeeping-work-time-model-complete.class';
import { TimekeepingWorkTimeModelDataService } from './timekeeping-work-time-model-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingTimeSymbol2WorkTimeModelDataService extends DataServiceFlatLeaf<ITimeSymbol2WorkTimeModelEntity,IWorkTimeModelEntity, TimekeepingWorkTimeModelComplete >{

	public constructor(timekeepingWorkTimeModelDataService :TimekeepingWorkTimeModelDataService) {
		const options: IDataServiceOptions<ITimeSymbol2WorkTimeModelEntity>  = {
			apiUrl: 'timekeeping/worktimemodel/timesymbol2worktime',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},

			roleInfo: <IDataServiceChildRoleOptions<ITimeSymbol2WorkTimeModelEntity,IWorkTimeModelEntity, TimekeepingWorkTimeModelComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'TimeSymbol2WorkTimeModel',
				parent: timekeepingWorkTimeModelDataService,
			},


		};

		super(options);
	}

	public override isParentFn(parentKey: IWorkTimeModelEntity, entity: ITimeSymbol2WorkTimeModelEntity): boolean {
		return entity.WorkingTimeModelFk !== null;
	}

}



