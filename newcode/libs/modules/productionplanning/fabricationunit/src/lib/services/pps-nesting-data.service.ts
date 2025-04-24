/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { get } from 'lodash';
import { Injectable, InjectionToken } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceOptions,
	ServiceRole,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions, IEntityList
} from '@libs/platform/data-access';

import { IPpsFabricationUnitEntity, IPpsNestingEntity } from '../model/models';
import { PpsFabricationunitComplete } from '../model/pps-fabricationunit-complete.class';
import { PpsFabricationunitDataService } from './pps-fabricationunit-data.service';


export const PPS_NESTING_DATA_TOKEN = new InjectionToken<PpsNestingDataService>('ppsNestingDataToken');

@Injectable({
	providedIn: 'root'
})

export class PpsNestingDataService extends DataServiceFlatLeaf<IPpsNestingEntity, IPpsFabricationUnitEntity, PpsFabricationunitComplete> {

	public constructor(parentDataService: PpsFabricationunitDataService) {
		const options: IDataServiceOptions<IPpsNestingEntity> = {
			apiUrl: 'productionplanning/fabricationunit/nesting',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getByFabricationUnit',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsNestingEntity, IPpsFabricationUnitEntity, PpsFabricationunitComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Nesting',
				parent: parentDataService,
			},
		};
		super(options);
	}

	private transferModification2Complete(complete: PpsFabricationunitComplete, modified: IPpsNestingEntity[], deleted: IPpsNestingEntity[]) {
		if (modified && modified.length > 0) {
			complete.NestingToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			complete.NestingToDelete = deleted;
		}
	}

	private takeOverUpdatedFromComplete(complete: PpsFabricationunitComplete, entityList: IEntityList<IPpsNestingEntity>) {
		if (complete && complete.NestingToSave && complete.NestingToSave.length > 0) {
			entityList.updateEntities(complete.NestingToSave);
		}
	}

	protected override onLoadSucceeded(loaded: object): IPpsNestingEntity[] {
		if (loaded) {
			return get(loaded, 'Main')! as IPpsNestingEntity[];
		}
		return [];
	}

	protected override provideLoadPayload(): object {
		const selectedFabricationUnit = this.getSelectedParent();
		if (selectedFabricationUnit) {
			return { fabricationUnitId: selectedFabricationUnit.Id };
		} else {
			throw new Error('There should be a selected fabricationUnit to load the corresponding nesting data');
		}
	}
}

