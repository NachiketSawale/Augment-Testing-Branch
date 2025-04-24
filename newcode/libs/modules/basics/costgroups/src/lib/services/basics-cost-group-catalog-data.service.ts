/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';

import { BasicsCostGroupCatalogEntity } from '../model/entities/basics-cost-group-catalog-entity.class';
import { BasicsCostGroupCatalogComplete } from '../model/basics-cost-group-catalog-complete.class';
import * as _ from 'lodash';

export const BASICS_COST_GROUP_CATALOG_DATA_TOKEN = new InjectionToken<BasicsCostGroupCatalogDataService>('basicsCostGroupCatalogDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsCostGroupCatalogDataService extends DataServiceFlatRoot<BasicsCostGroupCatalogEntity, BasicsCostGroupCatalogComplete> {
	private fromUriNavigation: boolean = false;

	public constructor() {
		const options: IDataServiceOptions<BasicsCostGroupCatalogEntity> = {
			apiUrl: 'basics/costgroupcat',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listfiltered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<BasicsCostGroupCatalogEntity>>{
				role: ServiceRole.Root,
				itemName: 'CostGroupCatToSave',
			},
		};

		super(options);

	}
	public override createUpdateEntity(modified: BasicsCostGroupCatalogEntity | null): BasicsCostGroupCatalogComplete {
		const complete = new BasicsCostGroupCatalogComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.CostGroupCatToSave = modified;
			complete.EntitiesCount = 1;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: BasicsCostGroupCatalogComplete): BasicsCostGroupCatalogEntity[] {
		/*if (complete.Contracts === null) {
			complete.Contracts = [];
		}

		return complete.Contracts;*/
		return [];
	}

	protected override onLoadSucceeded(loaded: object): BasicsCostGroupCatalogEntity[] {
		// super.onLoadSucceeded(loaded);
		if(this.fromUriNavigation){
			this.fromUriNavigation = false;
			this.goToFirst();
		}

		if (loaded) {
			return _.get(loaded,
				'dtos'
				, []);
		}
		return [];
	}

}
