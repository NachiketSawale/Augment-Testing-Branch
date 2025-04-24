/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { EquipmentGroupUpdate } from '../model/equipment-group-update.class';
import { EquipmentGroupDataService } from './equipment-group-data.service';
import { IEquipmentGroupEurolistEntity, IEquipmentGroupEntity } from '@libs/resource/interfaces';

export const EQUIPMENT_GROUP_EUROLIST_DATA_TOKEN = new InjectionToken<EquipmentGroupEurolistDataService>('equipmentGroupEurolistDataToken');
@Injectable({
	providedIn: 'root'
})
export class EquipmentGroupEurolistDataService extends DataServiceFlatLeaf<IEquipmentGroupEurolistEntity,IEquipmentGroupEntity,EquipmentGroupUpdate> {
	public constructor() {
		const options: IDataServiceOptions<IEquipmentGroupEurolistEntity> = {
			apiUrl: 'resource/equipmentgroup/eurolist',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IEquipmentGroupEurolistEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'EquipmentGroupEurolist',
				parent: inject(EquipmentGroupDataService)
			},
			processors: [new EntityArrayProcessor<IEquipmentGroupEurolistEntity>(['SubResources'])]
		};
		super(options);
	}
}