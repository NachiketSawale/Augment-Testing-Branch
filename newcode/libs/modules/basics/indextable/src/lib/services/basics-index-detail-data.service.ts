/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';

import {

	ServiceRole,
	IDataServiceOptions,
	IDataServiceEndPointOptions,
	IDataServiceChildRoleOptions, DataServiceFlatLeaf
} from '@libs/platform/data-access';

import { BasicsIndexDetailEntity } from '../model/basics-index-detail-entity.class';
import {BasicsIndexHeaderEntity} from '../model/basics-index-header-entity.class';
import {BasicsIndexHeaderDataService} from './basics-index-header-data.service';
import {BasicsIndexHeaderComplete} from '../model/basics-index-header-complete.class';

export const BASICS_INDEX_DETAIL_DATA_TOKEN = new InjectionToken<BasicsIndexDetailDataService>('basicsIndexDetailDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsIndexDetailDataService extends DataServiceFlatLeaf<BasicsIndexDetailEntity,BasicsIndexHeaderEntity,BasicsIndexHeaderComplete> {
	public constructor() {
		const options: IDataServiceOptions<BasicsIndexDetailEntity> = {
			apiUrl: 'basics/indexdetail',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return {mainItemId: ident.pKey1};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceChildRoleOptions<BasicsIndexDetailEntity,BasicsIndexHeaderEntity,BasicsIndexHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'IndexDetail',
				parent: inject(BasicsIndexHeaderDataService),
			},
		};

		super(options);
	}
	
	protected override onCreateSucceeded(loaded: object): BasicsIndexDetailEntity {
		const parent = this.getSelectedParent();
		const entity = loaded as BasicsIndexDetailEntity;
		if (entity && parent) {
			entity.BasIndexHeaderFk = parent.Id;
		}
		return entity;
	}
	public override registerByMethod(): boolean {
		return true;
	}
	public override registerModificationsToParentUpdate(parentUpdate: BasicsIndexHeaderComplete, modified: BasicsIndexDetailEntity[], deleted: BasicsIndexDetailEntity[]): void {
		if (modified && modified.some(() => true)) {
			if(modified && modified.length > 0){
				parentUpdate.IndexDetailToSave = modified;
				parentUpdate.EntitiesCoun = 1;
				parentUpdate.MainItemId = modified[0].BasIndexHeaderFk;
			}
		}
		if (deleted && deleted.some(() => true)) {
			parentUpdate.IndexDetailToDelete = deleted;
		}
	}
	public override getSavedEntitiesFromUpdate(complete: BasicsIndexHeaderComplete): BasicsIndexDetailEntity[] {
		if (complete && complete.IndexDetailToSave) {
			return complete.IndexDetailToSave;
		}
		return [];
	}
}
