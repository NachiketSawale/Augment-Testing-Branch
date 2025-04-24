/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { EquipmentGroupUpdate } from '../model/equipment-group-update.class';
import { EquipmentGroupDataService } from './equipment-group-data.service';
import { IPlantGroup2CostCodeEntity, IEquipmentGroupEntity } from '@libs/resource/interfaces';

export const PLANT_GROUP_2_COST_CODE_DATA_TOKEN = new InjectionToken<PlantGroup2CostCodeDataService>('plantGroup2CostCodeDataToken');
@Injectable({
	providedIn: 'root'
})
export class PlantGroup2CostCodeDataService extends DataServiceFlatLeaf<IPlantGroup2CostCodeEntity,IEquipmentGroupEntity,EquipmentGroupUpdate> {
	public constructor() {
		const options: IDataServiceOptions<IPlantGroup2CostCodeEntity> = {
			apiUrl: 'resource/equipmentgroup/plantgroup2costcode',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IPlantGroup2CostCodeEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PlantGroup2CostCode',
				parent: inject(EquipmentGroupDataService)
			},
			processors: [new EntityArrayProcessor<IPlantGroup2CostCodeEntity>(['SubResources'])]
		};
		super(options);
	}
}