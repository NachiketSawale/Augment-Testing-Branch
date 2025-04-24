/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ITimekeepingValidationEntity } from '../model/entities/timekeeping-validation-entity.interface';
import { IPeriodEntity } from '../model/entities/period-entity.interface';
import { TimekeepingPeriodDataService } from './timekeeping-period-data.service';
import { TimekeepingPeriodComplete } from '../model/timekeeping-period-complete.class';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingPeriodValidationDataService extends DataServiceFlatLeaf<ITimekeepingValidationEntity,IPeriodEntity, TimekeepingPeriodComplete >{

	public constructor(timekeepingPeriodDataService : TimekeepingPeriodDataService) {
		const options: IDataServiceOptions<ITimekeepingValidationEntity>  = {
			apiUrl: 'timekeeping/period/validation',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<ITimekeepingValidationEntity,IPeriodEntity, TimekeepingPeriodComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Validations',
				parent: timekeepingPeriodDataService,
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			}
		};
		super(options);
	}

	public override isParentFn(parentKey: IPeriodEntity, entity: ITimekeepingValidationEntity): boolean {
		return entity.PeriodFk === parentKey.Id;
	}
}



