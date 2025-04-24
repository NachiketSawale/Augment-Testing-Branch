/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';

import { BasicSite2ClerkEntity } from '../model/basic-site2-clerk-entity.class';
import { BasicSite2ClerkComplete } from '../model/basic-site2-clerk-complete.class';
import { IIdentificationData } from '@libs/platform/common';
import { BasicsSiteGridDataService } from './basics-site-grid-data.service';
import { BasicsSiteGridEntity } from '../model/basics-site-grid-entity.class';
import { BasicsSiteGridComplete } from '../model/basics-site-grid-complete.class';

export const BASIC_SITE2_CLERK_DATA_TOKEN = new InjectionToken<BasicSite2ClerkDataService>('basicSite2ClerkDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicSite2ClerkDataService extends DataServiceFlatLeaf<BasicSite2ClerkEntity, BasicSite2ClerkComplete, BasicsSiteGridComplete> {
	public constructor(basicSiteGridService: BasicsSiteGridDataService) {
		const options: IDataServiceOptions<BasicSite2ClerkEntity> = {
			apiUrl: 'basics/site/site2clerk',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident: IIdentificationData) => {
					return {siteId: ident.pKey1};
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
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<BasicSite2ClerkEntity, BasicsSiteGridEntity, BasicsSiteGridComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Site2Clerk',
				parent: basicSiteGridService,
				parentFilter: 'siteId'
			},
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: BasicsSiteGridComplete, modified: BasicSite2ClerkEntity[], deleted: BasicSite2ClerkEntity[]) {
		if (modified && modified.some(() => true)) {
			parentUpdate.Site2ClerkToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.Site2ClerkToDelete = deleted;
		}
	}
	public override isParentFn(parentKey: BasicsSiteGridComplete, entity: BasicSite2ClerkEntity): boolean {
		return true;
	}
	public override getSavedEntitiesFromUpdate(complete: BasicsSiteGridComplete): BasicSite2ClerkEntity[] {
		if (complete && complete.Site2ClerkToSave) {
			return complete.Site2ClerkToSave;
		}
		return [];
	}

}
