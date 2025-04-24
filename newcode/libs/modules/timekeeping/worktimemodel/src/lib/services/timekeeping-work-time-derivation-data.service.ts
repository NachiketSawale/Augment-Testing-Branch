/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';



import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';




import { IWorkTimeDerivationEntity } from '../model/entities/work-time-derivation-entity.interface';
import { IWorkTimeModelEntity } from '../model/entities/work-time-model-entity.interface';
import { TimekeepingWorkTimeModelComplete } from '../model/timekeeping-work-time-model-complete.class';
import { TimekeepingWorkTimeModelDataService } from './timekeeping-work-time-model-data.service';



@Injectable({
	providedIn: 'root'
})





export class TimekeepingWorkTimeDerivationDataService extends DataServiceFlatLeaf<IWorkTimeDerivationEntity,IWorkTimeModelEntity, TimekeepingWorkTimeModelComplete >{

	public constructor(timekeepingWorkTimeModelDataService :TimekeepingWorkTimeModelDataService) {
		const options: IDataServiceOptions<IWorkTimeDerivationEntity>  = {
			apiUrl: 'timekeeping/worktimemodel/derivation',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IWorkTimeDerivationEntity,IWorkTimeModelEntity, TimekeepingWorkTimeModelComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'WorkTimeDerivation',
				parent: timekeepingWorkTimeModelDataService,
			},


		};

		super(options);
	}

	public override isParentFn(parentKey: IWorkTimeModelEntity, entity: IWorkTimeDerivationEntity): boolean {
		return entity.WorkingTimeModelFk === parentKey.Id;
	}

}



