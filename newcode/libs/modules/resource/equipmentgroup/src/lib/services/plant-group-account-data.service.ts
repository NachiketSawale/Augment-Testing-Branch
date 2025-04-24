/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { EquipmentGroupUpdate } from '../model/equipment-group-update.class';
import { EquipmentGroupDataService } from './equipment-group-data.service';
import { IPlantGroupAccountEntity, IEquipmentGroupEntity } from '@libs/resource/interfaces';

export const PLANT_GROUP_ACCOUNT_DATA_TOKEN = new InjectionToken<PlantGroupAccountDataService>('plantGroupAccountDataToken');
@Injectable({
	providedIn: 'root'
})
export class PlantGroupAccountDataService extends DataServiceFlatLeaf<IPlantGroupAccountEntity,IEquipmentGroupEntity,EquipmentGroupUpdate> {
	public constructor() {
		const options: IDataServiceOptions<IPlantGroupAccountEntity> = {
			apiUrl: 'resource/equipmentGroup/account',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IPlantGroupAccountEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PlantGroupAccount',
				parent: inject(EquipmentGroupDataService)
			},
			processors: [new EntityArrayProcessor<IPlantGroupAccountEntity>(['SubResources'])]
		};
		super(options);
	}
}