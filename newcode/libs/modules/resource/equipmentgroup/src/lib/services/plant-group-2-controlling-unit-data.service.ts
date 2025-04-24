/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { EquipmentGroupUpdate } from '../model/equipment-group-update.class';
import { EquipmentGroupDataService } from './equipment-group-data.service';
import { IPlantGroup2ControllingUnitEntity, IEquipmentGroupEntity } from '@libs/resource/interfaces';

export const PLANT_GROUP_2_CONTROLLING_UNIT_DATA_TOKEN = new InjectionToken<PlantGroup2ControllingUnitDataService>('plantGroup2ControllingUnitDataToken');
@Injectable({
	providedIn: 'root'
})
export class PlantGroup2ControllingUnitDataService extends DataServiceFlatLeaf<IPlantGroup2ControllingUnitEntity,IEquipmentGroupEntity,EquipmentGroupUpdate> {
	public constructor() {
		const options: IDataServiceOptions<IPlantGroup2ControllingUnitEntity> = {
			apiUrl: 'resource/equipmentgroup/controllingunit',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IPlantGroup2ControllingUnitEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PlantGroup2ControllingUnit',
				parent: inject(EquipmentGroupDataService)
			},
			processors: [new EntityArrayProcessor<IPlantGroup2ControllingUnitEntity>(['SubResources'])]
		};
		super(options);
	}
}