/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';

import { BasicsSite2StockEntity } from '../model/basics-site2-stock-entity.class';
import { BasicsSite2StockComplete } from '../model/basics-site2-stock-complete.class';
import { BasicsSiteGridEntity } from '../model/basics-site-grid-entity.class';
import { BasicsSiteGridComplete } from '../model/basics-site-grid-complete.class';
import { BasicsSiteGridDataService } from './basics-site-grid-data.service';
import { IIdentificationData } from '@libs/platform/common';

export const BASICS_SITE2_STOCK_DATA_TOKEN = new InjectionToken<BasicsSite2StockDataService>('basicsSite2StockDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsSite2StockDataService extends DataServiceFlatLeaf<BasicsSite2StockEntity, BasicsSite2StockComplete, BasicsSiteGridComplete> {
	public constructor(basicSiteGridService: BasicsSiteGridDataService) {
		const options: IDataServiceOptions<BasicsSite2StockEntity> = {
			apiUrl: 'basics/site/site2stock',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident: IIdentificationData) => {
					return {mainItemId: ident.pKey1};
				},
			},
			createInfo:<IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: ident => {
					return { Id : ident.pKey1};
				}
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceChildRoleOptions<BasicsSite2StockEntity, BasicsSiteGridEntity, BasicsSiteGridComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Site2Stocks',
				parent: basicSiteGridService
			},
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}
		
	public override registerModificationsToParentUpdate(parentUpdate: BasicsSiteGridComplete, modified: BasicsSite2StockEntity[], deleted: BasicsSite2StockEntity[]) {
		if(modified && modified.some(() => true)) {
			parentUpdate.Site2StocksToSave = modified;
		}
		if(deleted && deleted.some(() => true)) {
			parentUpdate.Site2StocksToDelete = deleted;
		}		
	}

	public override isParentFn(parentKey: BasicsSiteGridEntity, entity: BasicsSite2StockEntity): boolean {
		return true;
	}

	public override getSavedEntitiesFromUpdate(complete: BasicsSiteGridComplete): BasicsSite2StockEntity[] {
		if( complete &&complete.Site2StocksToSave) {
			complete.Site2StocksToSave;
		}
		return[];
		
		
	}
}
