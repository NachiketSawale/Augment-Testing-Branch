/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';

import { BasicsSite2TksShiftEntity } from '../model/basics-site2-tks-shift-entity.class';
import { BasicsSite2TksShiftComplete } from '../model/basics-site2-tks-shift-complete.class';
import { IIdentificationData } from '@libs/platform/common';
import { BasicsSiteGridComplete } from '../model/basics-site-grid-complete.class';
import { BasicsSiteGridEntity } from '../model/basics-site-grid-entity.class';
import { BasicsSiteGridDataService } from './basics-site-grid-data.service';

export const BASICS_SITE2_TKS_SHIFT_DATA_TOKEN = new InjectionToken<BasicsSite2TksShiftDataService>('basicsSite2TksShiftDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsSite2TksShiftDataService extends DataServiceFlatLeaf<BasicsSite2TksShiftEntity, BasicsSite2TksShiftComplete, BasicsSiteGridComplete> {
	public constructor(basicSiteGridService: BasicsSiteGridDataService) {
		const options: IDataServiceOptions<BasicsSite2TksShiftEntity> = {
			apiUrl: 'basics/site/site2tksshift',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident: IIdentificationData) => {
					return {mainItemId: ident.pKey1};
				},
			},
			createInfo:<IDataServiceEndPointOptions> {
				endPoint: 'create',
				prepareParam: ident => {
					return { Id : ident.pKey1};
				}
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			deleteInfo: <IDataServiceEndPointOptions> {
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceChildRoleOptions<BasicsSite2TksShiftEntity,  BasicsSiteGridEntity, BasicsSiteGridComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Site2TksShifts',
				parent: basicSiteGridService
			},
		};

		super(options);
	}
	
	public override registerByMethod(): boolean {
		return true;
	}

	public override isParentFn(parentKey: BasicsSiteGridEntity, entity: BasicsSite2TksShiftEntity): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: BasicsSiteGridComplete, modified: BasicsSite2TksShiftEntity[], deleted: BasicsSite2TksShiftEntity[]) {
		if (modified && modified.some(() => true)) {
			parentUpdate.Site2TksShiftsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.Site2TksShiftsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: BasicsSiteGridComplete): BasicsSite2TksShiftEntity[] {
		if (complete && complete.Site2TksShiftsToSave) {
			return complete.Site2TksShiftsToSave;
		}
		return [];
	}
	
}
