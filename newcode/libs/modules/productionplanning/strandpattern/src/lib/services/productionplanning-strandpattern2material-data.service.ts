/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';

import { ProductionplanningStrandpattern2materialEntity } from '../model/productionplanning-strandpattern2material-entity.class';
import { IIdentificationData } from '@libs/platform/common';
import { ProductionplanningStrandpatternDataService } from './productionplanning-strandpattern-data.service';
import { ProductionplanningStrandpatternEntity } from '../model/productionplanning-strandpattern-entity.class';
import { ProductionplanningStrandpatternComplete } from '../model/productionplanning-strandpattern-complete.class';

export const PRODUCTIONPLANNING_STRANDPATTERN2MATERIAL_DATA_TOKEN = new InjectionToken<ProductionplanningStrandpattern2materialDataService>('productionplanningStrandpattern2materialDataToken');

@Injectable({
	providedIn: 'root',
})
export class ProductionplanningStrandpattern2materialDataService extends DataServiceFlatLeaf<ProductionplanningStrandpattern2materialEntity, ProductionplanningStrandpatternEntity, ProductionplanningStrandpatternComplete> {
	public constructor(productionplanningStrandPattern : ProductionplanningStrandpatternDataService) {
		const options: IDataServiceOptions<ProductionplanningStrandpattern2materialEntity> = {
			apiUrl: 'productionplanning/strandpattern/strandpattern2material',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbystrandpattern',
				usePost: false,
				prepareParam: (ident: IIdentificationData) => {
					return {strandPatternId: ident.pKey1};
				},
			},
			createInfo: <IDataServiceEndPointOptions> {
				endPoint: 'create',
				prepareParam: ident => {
					return { pKey1 : ident.pKey1};
				}
			},
			updateInfo:<IDataServiceEndPointOptions>{
				endPoint:'update',
			},
			roleInfo: <IDataServiceChildRoleOptions<ProductionplanningStrandpattern2materialEntity, ProductionplanningStrandpatternEntity, ProductionplanningStrandpatternComplete >>{
				role: ServiceRole.Leaf,
				itemName: 'StrandPattern2Material',
				parent:productionplanningStrandPattern
			},
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override isParentFn(parentKey: ProductionplanningStrandpatternEntity, entity: ProductionplanningStrandpattern2materialEntity): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate : ProductionplanningStrandpatternComplete, modified: ProductionplanningStrandpattern2materialEntity[], deleted :ProductionplanningStrandpattern2materialEntity[]): void {
		if(modified && modified.length > 0) {
			parentUpdate.StrandPattern2MaterialToSave = modified;
		}
		if(deleted && deleted.length > 0 ) {
			parentUpdate.StrandPattern2MaterialToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: ProductionplanningStrandpatternComplete): ProductionplanningStrandpattern2materialEntity[] {
		if(complete && complete.StrandPattern2MaterialToSave) {
			return complete.StrandPattern2MaterialToSave;
		}
		return [];
	}
	
}
