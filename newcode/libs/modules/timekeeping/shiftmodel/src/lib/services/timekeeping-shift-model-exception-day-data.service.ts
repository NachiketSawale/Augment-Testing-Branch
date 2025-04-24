/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { TimekeepingShiftModelDataService } from './timekeeping-shift-model-data.service';
import { IExceptionDayEntity } from '../model/entities/exception-day-entity.interface';
import { IShiftEntity } from '../model/entities/shift-entity.interface';
import { ShiftComplete } from '../model/entities/shift-complete.class';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingShiftModelExceptionDayDataService extends DataServiceFlatLeaf<IExceptionDayEntity,
	IShiftEntity, ShiftComplete> {

	public constructor(timekeepingShiftModelDataService : TimekeepingShiftModelDataService) {
		const options: IDataServiceOptions<IExceptionDayEntity> = {
			apiUrl: 'timekeeping/shiftmodel/exceptionday',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return {pKey1: ident.pKey1};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IExceptionDayEntity,
				IShiftEntity, ShiftComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'ExceptionDays',
				parent: timekeepingShiftModelDataService
			}
		};

		super(options);
	}
	public override isParentFn(parentKey: IShiftEntity, entity: IExceptionDayEntity): boolean {
		return entity.ShiftFk === parentKey.Id;
	}
}





