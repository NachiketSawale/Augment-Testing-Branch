/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import {
	DataServiceFlatRoot,
	ServiceRole,
	IDataServiceOptions,
	IDataServiceEndPointOptions,
	IDataServiceRoleOptions
} from '@libs/platform/data-access';

import { PpsFabricationunitComplete } from '../model/pps-fabricationunit-complete.class';
import { IPpsFabricationUnitEntity } from '../model/entities/pps-fabrication-unit-entity.interface';


export const PPS_FABRICATIONUNIT_DATA_TOKEN = new InjectionToken<PpsFabricationunitDataService>('ppsFabricationunitDataToken');

@Injectable({
	providedIn: 'root'
})

export class PpsFabricationunitDataService extends DataServiceFlatRoot<IPpsFabricationUnitEntity, PpsFabricationunitComplete> {

	public constructor() {
		const options: IDataServiceOptions<IPpsFabricationUnitEntity> = {
			apiUrl: 'productionplanning/fabricationunit',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IPpsFabricationUnitEntity>>{
				role: ServiceRole.Root,
				itemName: 'FabricationUnits',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPpsFabricationUnitEntity | null): PpsFabricationunitComplete {
		const complete = new PpsFabricationunitComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.FabricationUnits = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: PpsFabricationunitComplete): IPpsFabricationUnitEntity[] {
		if (complete.FabricationUnits === null) {
			complete.FabricationUnits = [];
		}
		return complete.FabricationUnits;
	}

}





