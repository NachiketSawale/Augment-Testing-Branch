/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';

import { BasicsSite2ExternalEntity } from '../model/basics-site2-external-entity.class';
import { BasicsSite2ExternalComplete } from '../model/basics-site2-external-complete.class';
import { IIdentificationData } from '@libs/platform/common';
import { BasicsSiteGridComplete } from '../model/basics-site-grid-complete.class';
import { BasicsSiteGridEntity } from '../model/basics-site-grid-entity.class';
import { BasicsSiteGridDataService } from './basics-site-grid-data.service';

export const BASICS_SITE2_EXTERNAL_DATA_TOKEN = new InjectionToken<BasicsSite2ExternalDataService>('basicsSite2ExternalDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsSite2ExternalDataService extends DataServiceFlatLeaf<BasicsSite2ExternalEntity, BasicsSite2ExternalComplete, BasicsSiteGridComplete> {
	public constructor(basicsSteGridService: BasicsSiteGridDataService) {
		const options: IDataServiceOptions<BasicsSite2ExternalEntity> = {
			apiUrl: 'basics/site/site2external',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident: IIdentificationData) => {
					return {mainItemId: ident.pKey1};
				},
			},
			createInfo: <IDataServiceEndPointOptions> {
				endPoint: 'create',
				prepareParam: ident => {
					return { Id : ident.pKey1};
				}
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update',
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<BasicsSite2ExternalEntity,BasicsSiteGridEntity,BasicsSiteGridComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Site2Externals',
				parent: basicsSteGridService
			},
		};

		super(options);
	}
	public override registerByMethod(): boolean {
		return true;
	}

	public override isParentFn(parentKey: BasicsSiteGridEntity, entity: BasicsSite2ExternalEntity): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: BasicsSiteGridComplete, modified: BasicsSite2ExternalEntity[], deleted: BasicsSite2ExternalEntity[]) {
		if (modified && modified.some(() => true)) {
			parentUpdate.Site2ExternalsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.Site2ExternalsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: BasicsSiteGridComplete): BasicsSite2ExternalEntity[] {
		if (complete && complete.Site2ExternalsToSave) {
			return complete.Site2ExternalsToSave;
		}
		return [];
	}

}
