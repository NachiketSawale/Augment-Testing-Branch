/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { EquipmentGroupUpdate } from '../model/equipment-group-update.class';
import { EquipmentGroupDataService } from './equipment-group-data.service';
import { IPlantGroupTaxCodeEntity, IEquipmentGroupEntity } from '@libs/resource/interfaces';

export const PLANT_GROUP_TAX_CODE_DATA_TOKEN = new InjectionToken<PlantGroupTaxCodeDataService>('plantGroupTaxCodeDataToken');
@Injectable({
	providedIn: 'root'
})
export class PlantGroupTaxCodeDataService extends DataServiceFlatLeaf<IPlantGroupTaxCodeEntity,IEquipmentGroupEntity,EquipmentGroupUpdate> {
	public constructor() {
		const options: IDataServiceOptions<IPlantGroupTaxCodeEntity> = {
			apiUrl: 'resource/equipmentgroup/taxcode',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IPlantGroupTaxCodeEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PlantGroupTaxCode',
				parent: inject(EquipmentGroupDataService)
			},
			processors: [new EntityArrayProcessor<IPlantGroupTaxCodeEntity>(['SubResources'])]
		};
		super(options);
	}
}