/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { EquipmentGroupUpdate } from '../model/equipment-group-update.class';
import { EquipmentGroupDataService } from './equipment-group-data.service';
import { IPlantGroupSpecificValueEntity, IEquipmentGroupEntity } from '@libs/resource/interfaces';

export const PLANT_GROUP_SPECIFIC_VALUE_DATA_TOKEN = new InjectionToken<PlantGroupSpecificValueDataService>('plantGroupSpecificValueDataToken');
@Injectable({
	providedIn: 'root'
})
export class PlantGroupSpecificValueDataService extends DataServiceFlatLeaf<IPlantGroupSpecificValueEntity,IEquipmentGroupEntity,EquipmentGroupUpdate> {
	public constructor() {
		const options: IDataServiceOptions<IPlantGroupSpecificValueEntity> = {
			apiUrl: 'resource/equipmentgroup/specificvalue',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IPlantGroupSpecificValueEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PlantGroupSpecificValue',
				parent: inject(EquipmentGroupDataService)
			},
			processors: [new EntityArrayProcessor<IPlantGroupSpecificValueEntity>(['SubResources'])]
		};
		super(options);
	}
}