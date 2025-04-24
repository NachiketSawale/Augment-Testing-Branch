/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { TimekeepingShiftModelDataService } from './timekeeping-shift-model-data.service';
import { IShift2GroupEntity } from '../model/entities/shift-2group-entity.interface';
import { IShiftEntity } from '../model/entities/shift-entity.interface';
import { ShiftComplete } from '../model/entities/shift-complete.class';


@Injectable({
	providedIn: 'root'
})

export class TimekeepingShiftModel2GroupDataService extends DataServiceFlatLeaf<IShift2GroupEntity,
	IShiftEntity, ShiftComplete> {

	public constructor(timekeepingShiftModelDataService : TimekeepingShiftModelDataService) {
		const options: IDataServiceOptions<IShift2GroupEntity> = {
			apiUrl: 'timekeeping/shiftmodel/shift2group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return {pKey1: ident.pKey1};
				}
			},

			roleInfo: <IDataServiceChildRoleOptions<IShift2GroupEntity,
				IShiftEntity, ShiftComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'Shift2Groups',
				parent: timekeepingShiftModelDataService
			}
		};

		super(options);
	}
	public override isParentFn(parentKey: IShiftEntity, entity: IShift2GroupEntity): boolean {
		return entity.ShiftFk === parentKey.Id;
	}
}





