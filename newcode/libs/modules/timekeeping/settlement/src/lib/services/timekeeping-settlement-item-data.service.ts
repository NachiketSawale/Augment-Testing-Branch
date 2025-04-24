/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { ITimekeepingSettlementComplete } from '../model/timekeeping-settlement-complete.class';
import { TimekeepingSettlementDataService } from './timekeeping-settlement-data.service';
import { ITimekeepingSettlementEntity, ITimekeepingSettlementItemEntity } from '@libs/timekeeping/interfaces';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingSettlementItemDataService extends DataServiceFlatLeaf<ITimekeepingSettlementItemEntity, ITimekeepingSettlementEntity, ITimekeepingSettlementComplete> {
	public constructor(timekeepingSettlementDataService : TimekeepingSettlementDataService) {
		const options: IDataServiceOptions<ITimekeepingSettlementItemEntity> = {
			apiUrl: 'timekeeping/settlement/item',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return {pKey1: ident.pKey1};
				}
			},

			roleInfo: <IDataServiceChildRoleOptions<ITimekeepingSettlementItemEntity,
				ITimekeepingSettlementEntity, ITimekeepingSettlementComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'SettlementItems',
				parent: timekeepingSettlementDataService
			}
		};

		super(options);
	}
	public override isParentFn(parentKey: ITimekeepingSettlementEntity, entity: ITimekeepingSettlementItemEntity): boolean {
		return entity.SettlementFk === parentKey.Id;
	}
}
