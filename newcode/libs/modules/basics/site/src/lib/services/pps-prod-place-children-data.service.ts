/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';

import { PpsProdPlaceChildrenEntity } from '../model/pps-prod-place-children-entity.class';
import { IIdentificationData } from '@libs/platform/common';
import { PpsProductionPlaceEntity } from '../model/pps-production-place-entity.class';
import { PpsProductionPlaceComplete } from '../model/pps-production-place-complete.class';
import { PpsProductionPlaceDataService } from './pps-production-place-data.service';

export const PPS_PROD_PLACE_CHILDREN_DATA_TOKEN = new InjectionToken<PpsProdPlaceChildrenDataService>('ppsProdPlaceChildrenDataToken');

@Injectable({
	providedIn: 'root',
})
export class PpsProdPlaceChildrenDataService extends DataServiceFlatLeaf<PpsProdPlaceChildrenEntity,PpsProductionPlaceEntity, PpsProductionPlaceComplete> {
	public constructor(parentService: PpsProductionPlaceDataService ) {
		const options: IDataServiceOptions<PpsProdPlaceChildrenEntity> = {
			apiUrl: 'productionplanning/productionplace/children',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getchildren',
				usePost: false,
				prepareParam: (ident: IIdentificationData) => {
					return {prodPlaceId: ident.pKey1};
				},
			},		
			createInfo: <IDataServiceEndPointOptions> {
				endPoint: 'create',
				prepareParam: ident => {
					return { prodPlaceId : ident.pKey1};
				}
			},
			updateInfo: <IDataServiceEndPointOptions> {
				endPoint: 'update',
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceChildRoleOptions<PpsProdPlaceChildrenEntity,PpsProductionPlaceEntity, PpsProductionPlaceComplete>><unknown>{
				role: ServiceRole.Leaf,
				itemName: 'ProductionPlaceChildren',
				parent: parentService,
				parentFilter: 'prodPlaceId'
			},
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}
	

	public override isParentFn(parentKey: PpsProductionPlaceEntity, entity: PpsProdPlaceChildrenEntity): boolean {
			return true;
	}

	
	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent() as PpsProductionPlaceEntity;
		return {
			prodPlaceId: parent.Id
		};
	}

	protected override onLoadSucceeded(loaded: object): PpsProdPlaceChildrenEntity[] {
		return loaded as PpsProdPlaceChildrenEntity[];
	}

	public override registerModificationsToParentUpdate(parentUpdate: PpsProductionPlaceComplete, modified: PpsProdPlaceChildrenEntity[], deleted: PpsProdPlaceChildrenEntity[]) {
		if (modified && modified.some(() => true)) {
			parentUpdate.ProductionPlaceChildrenToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.ProductionPlaceChildrenToDelete = deleted;
		}
	}
		

	public override getSavedEntitiesFromUpdate(complete: PpsProductionPlaceComplete): PpsProdPlaceChildrenEntity[] {
		if (complete && complete.ProductionPlaceChildrenToSave) {
			return complete.ProductionPlaceChildrenToSave;
		}
		return [];
	}



}
