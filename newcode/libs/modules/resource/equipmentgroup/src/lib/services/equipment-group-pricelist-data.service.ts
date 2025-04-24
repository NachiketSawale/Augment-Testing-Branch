/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { EquipmentGroupUpdate } from '../model/equipment-group-update.class';
import { EquipmentGroupDataService } from './equipment-group-data.service';
import { IEquipmentGroupPricelistEntity, IEquipmentGroupEntity } from '@libs/resource/interfaces';

export const EQUIPMENT_GROUP_PRICELIST_DATA_TOKEN = new InjectionToken<EquipmentGroupPricelistDataService>('equipmentGroupPricelistDataToken');
@Injectable({
	providedIn: 'root'
})
export class EquipmentGroupPricelistDataService extends DataServiceFlatLeaf<IEquipmentGroupPricelistEntity,IEquipmentGroupEntity,EquipmentGroupUpdate> {
	public constructor() {
		const options: IDataServiceOptions<IEquipmentGroupPricelistEntity> = {
			apiUrl: 'resource/equipmentgroup/priceList',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IEquipmentGroupPricelistEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'EquipmentGroupPricelist',
				parent: inject(EquipmentGroupDataService)
			},
			processors: [new EntityArrayProcessor<IEquipmentGroupPricelistEntity>(['SubResources'])]
		};
		super(options);
	}
}