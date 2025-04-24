/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { PpsMaintenanceEntity } from '../model/entities/pps-maintenance-entity.class';
import { PpsProductionPlaceEntityComplete } from '../model/entities/pps-production-place-entity-complete.class';
import { PpsProductionPlaceDataService } from './pps-production-place-data.service';
import { PpsProductionPlaceEntity } from '@libs/productionplanning/shared';

@Injectable({
	providedIn: 'root',
})
export class PpsMaintenanceDataService extends DataServiceFlatLeaf<PpsMaintenanceEntity, PpsProductionPlaceEntity, PpsProductionPlaceEntityComplete> {
	public constructor(parentDataService: PpsProductionPlaceDataService) {
		const options: IDataServiceOptions<PpsMaintenanceEntity> = {
			apiUrl: 'productionplanning/productionplace/ppsmaintenance',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyproductionplace',
				usePost: false,
				prepareParam: (ident) => {
					return { prodPlaceId: ident.pKey1 };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<PpsMaintenanceEntity, PpsProductionPlaceEntity, PpsProductionPlaceEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PpsMaintenance',
				parent: parentDataService,
			},
		};

		super(options);
	}
}
