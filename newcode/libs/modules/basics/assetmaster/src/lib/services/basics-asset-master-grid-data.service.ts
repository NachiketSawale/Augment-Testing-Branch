/*
 * Copyright(c) RIB Software GmbH
 */

import { get } from 'lodash';
import { Injectable } from '@angular/core';
import { DataServiceHierarchicalRoot,IDataServiceEndPointOptions,IDataServiceRoleOptions,ServiceRole,IDataServiceOptions }
from '@libs/platform/data-access';
import { ISearchResult } from '@libs/platform/common';
import { IFilterResponse } from '@libs/basics/shared';
import { AssetMasterComplete, IAssetMasterEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root'
})

export class BasicsAssetMasterGridDataService extends DataServiceHierarchicalRoot<IAssetMasterEntity, AssetMasterComplete> {

	public constructor() {
		const options: IDataServiceOptions<IAssetMasterEntity> = {
			apiUrl: 'basics/assetmaster',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deletedata' 
			},
			roleInfo: <IDataServiceRoleOptions<IAssetMasterEntity>>{
				role: ServiceRole.Root,
				itemName: 'AssetMaster',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IAssetMasterEntity | null): AssetMasterComplete {
		const complete = new AssetMasterComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
		}

		return complete;
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IAssetMasterEntity> {
		const fr = get(loaded, 'FilterResult')! as IFilterResponse;
		return {
			FilterResult: {
				ExecutionInfo: fr.ExecutionInfo,
				RecordsFound: fr.RecordsFound,
				RecordsRetrieved: fr.RecordsRetrieved,
				ResultIds: fr.ResultIds
			},
			dtos: get(loaded, 'Main')! as IAssetMasterEntity[]
		};
	}

	public override childrenOf(element: IAssetMasterEntity): IAssetMasterEntity[] {
		return element.AssetMasterChildren ?? [];
	}

	public override parentOf(element: IAssetMasterEntity): IAssetMasterEntity | null {
		if (element.AssetMasterParentFk == null) {
			return null;
		}
		const parentId = element.AssetMasterParentFk;
		const parent = this.flatList().find(candidate => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}
}