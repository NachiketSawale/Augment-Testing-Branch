/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions, DataServiceFlatNode } from '@libs/platform/data-access';

import { PpsProductionPlaceEntity } from '../model/pps-production-place-entity.class';
import { PpsProductionPlaceComplete } from '../model/pps-production-place-complete.class';
import { IIdentificationData } from '@libs/platform/common';
import { BasicsSiteGridEntity } from '../model/basics-site-grid-entity.class';
import { BasicsSiteGridComplete } from '../model/basics-site-grid-complete.class';
import { BasicsSiteGridDataService } from './basics-site-grid-data.service';

export const PPS_PRODUCTION_PLACE_DATA_TOKEN = new InjectionToken<PpsProductionPlaceDataService>('ppsProductionPlaceDataToken');

@Injectable({
	providedIn: 'root',
})
export class PpsProductionPlaceDataService extends DataServiceFlatNode<PpsProductionPlaceEntity, PpsProductionPlaceComplete, BasicsSiteGridEntity,BasicsSiteGridComplete> {
	public constructor(basicSiteGridService: BasicsSiteGridDataService) {
		const options: IDataServiceOptions<PpsProductionPlaceEntity> = {
			apiUrl: 'productionplanning/productionplace',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listBySite',
				usePost: false,
				prepareParam: (ident: IIdentificationData) => {
					return {siteId: ident.pKey1};
				},
			},
			createInfo: <IDataServiceEndPointOptions> {
				endPoint: 'create',
				prepareParam: ident => {
					return { Id : ident.pKey1};
				}
			},
			updateInfo:<IDataServiceEndPointOptions>{
				endPoint: 'update',
			},
			deleteInfo: <IDataServiceEndPointOptions> {
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<PpsProductionPlaceEntity, BasicsSiteGridEntity, BasicsSiteGridComplete>>{
				role: ServiceRole.Node,
				itemName: 'ProductionPlace',
				parent: basicSiteGridService
			},
		};

		super(options);
	}

	

	public override registerByMethod(): boolean {
		return true;
	}

	public override createUpdateEntity(modified: PpsProductionPlaceEntity |null): PpsProductionPlaceComplete {
		const productionPlaceComplete = new PpsProductionPlaceComplete();
		if (modified !== null) {
			productionPlaceComplete.Id = modified.Id;
			productionPlaceComplete.ProductionPlace = [modified];
		}
		return productionPlaceComplete;
		
	}

	
	public override isParentFn(parentKey: BasicsSiteGridEntity, entity: PpsProductionPlaceEntity): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: BasicsSiteGridComplete, modified: PpsProductionPlaceComplete[], deleted: PpsProductionPlaceEntity[]): void {
		 if (modified && modified.some(() => true)){
			parentUpdate.ProductionPlaceToSave = modified;
		}
		 if (deleted && deleted.some(() => true))  {
			parentUpdate.ProductionPlaceToDelete = deleted;
		}
	}

	/**
	 * Handles the successful creation of an entity by casting and returning it.
	 * @param created
	 * @returns
	 */
	public override onCreateSucceeded(created: PpsProductionPlaceEntity): PpsProductionPlaceEntity {
		return created as PpsProductionPlaceEntity;
   }

   public override getSavedEntitiesFromUpdate(complete: BasicsSiteGridComplete): PpsProductionPlaceEntity[] {
	if (complete && complete.ProductionPlaceToSave) {
        return complete.ProductionPlaceToSave.map(place => place as unknown as PpsProductionPlaceEntity);
    }
    return [];
}
}
