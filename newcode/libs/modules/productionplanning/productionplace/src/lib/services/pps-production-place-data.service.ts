/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { PpsProductionPlaceEntityComplete } from '../model/entities/pps-production-place-entity-complete.class';
import { PpsProductionPlaceEntity } from '@libs/productionplanning/shared';

@Injectable({ providedIn: 'root' })
export class PpsProductionPlaceDataService extends DataServiceFlatRoot<PpsProductionPlaceEntity, PpsProductionPlaceEntityComplete> {
	public constructor() {
		const options: IDataServiceOptions<PpsProductionPlaceEntity> = {
			apiUrl: 'productionplanning/productionplace',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<PpsProductionPlaceEntity>>{
				role: ServiceRole.Root,
				itemName: 'ProductionPlace',
			},
		};
		super(options);
	}

	public override createUpdateEntity(modified: PpsProductionPlaceEntity | null): PpsProductionPlaceEntityComplete {
		const complete = new PpsProductionPlaceEntityComplete();
		if (modified) {
			complete.MainItemId = modified.Id;
			complete.ProductionPlace = modified;
		}

		return complete;
	}
}
