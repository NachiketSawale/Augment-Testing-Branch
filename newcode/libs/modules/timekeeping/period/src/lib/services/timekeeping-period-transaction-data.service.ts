/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ITimekeepingTransactionEntity } from '../model/entities/timekeeping-transaction-entity.interface';
import { TimekeepingPeriodDataService } from './timekeeping-period-data.service';
import { IPeriodEntity } from '../model/entities/period-entity.interface';
import { TimekeepingPeriodComplete } from '../model/timekeeping-period-complete.class';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingPeriodTransactionDataService extends DataServiceFlatLeaf<ITimekeepingTransactionEntity,IPeriodEntity, TimekeepingPeriodComplete>{

	public constructor(timekeepingPeriodDataService : TimekeepingPeriodDataService) {
		const options: IDataServiceOptions<ITimekeepingTransactionEntity>  = {
			apiUrl: 'timekeeping/period/transaction',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost:true
			},
			roleInfo: <IDataServiceChildRoleOptions<ITimekeepingTransactionEntity,IPeriodEntity,TimekeepingPeriodComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Transactions',
				parent: timekeepingPeriodDataService,
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			}
		};
		super(options);
	}

	public override isParentFn(parentKey: IPeriodEntity, entity: ITimekeepingTransactionEntity): boolean {
		return entity.PeriodFk === parentKey.Id;
	}
}



