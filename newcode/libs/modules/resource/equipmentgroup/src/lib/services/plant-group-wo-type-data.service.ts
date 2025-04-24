/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { EquipmentGroupUpdate } from '../model/equipment-group-update.class';
import { EquipmentGroupDataService } from './equipment-group-data.service';
import { IPlantGroupWoTypeEntity, IEquipmentGroupEntity } from '@libs/resource/interfaces';

export const PLANT_GROUP_WO_TYPE_DATA_TOKEN = new InjectionToken<PlantGroupWoTypeDataService>('plantGroupWoTypeDataToken');
@Injectable({
	providedIn: 'root'
})
export class PlantGroupWoTypeDataService extends DataServiceFlatLeaf<IPlantGroupWoTypeEntity,IEquipmentGroupEntity,EquipmentGroupUpdate> {
	public constructor() {
		const options: IDataServiceOptions<IPlantGroupWoTypeEntity> = {
			apiUrl: 'resource/equipmentgroup/workordertype',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IPlantGroupWoTypeEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PlantGroupWoType',
				parent: inject(EquipmentGroupDataService)
			},
			processors: [new EntityArrayProcessor<IPlantGroupWoTypeEntity>(['SubResources'])]
		};
		super(options);
	}
}