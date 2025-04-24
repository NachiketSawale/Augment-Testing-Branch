/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPermissionsEntity, IMtwoPowerbiItemEntity, MtwoPowerbiPermissionComplete } from '@libs/mtwo/interfaces';
import { ISearchPayload, ISearchResult } from '@libs/platform/common';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole, IDataServiceOptions, EntityArrayProcessor } from '@libs/platform/data-access';
import { MtwoControlTowerConfigurationDataService } from './mtwo-control-tower-configuration-data.service';
import { IFilterResponse } from '@libs/basics/shared';

interface ITowerConfigurationPermissionsResponse {
	FilterResult: IFilterResponse;
	Reports: IPermissionsEntity[];
}

/**
 * Mtwo Control Tower Configuration Permissions Data Service
 */
@Injectable({
	providedIn: 'root',
})
export class MtwoControlTowerConfigurationPermissionsDataService extends DataServiceHierarchicalRoot<IMtwoPowerbiItemEntity, MtwoPowerbiPermissionComplete> {
	public mtwoControlTowerConfigurationDataService =inject(MtwoControlTowerConfigurationDataService);
	public constructor() {
		const options: IDataServiceOptions<IMtwoPowerbiItemEntity> = {
			apiUrl: 'mtwo/controltower/powerbimodules/permissions',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listfiltered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceRoleOptions<IMtwoPowerbiItemEntity>>{
				role: ServiceRole.Root,
				itemName: 'MtoPowerbiitem',
			},
			processors: [new EntityArrayProcessor<IMtwoPowerbiItemEntity>(['Modules'])]
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPermissionsEntity | null): MtwoPowerbiPermissionComplete {
		const complete = new MtwoPowerbiPermissionComplete();
		if (modified?.Reports && Array.isArray(modified.Reports) && modified.Reports.length > 0) {
			complete.Id = modified.Reports[0]?.Id || null;
		} else {
			complete.Id = null; 
		}
		complete.Data = modified ? [modified] : [];
		return complete;
	}

	protected override provideLoadByFilterPayload(payload:ISearchPayload) : object{
		const selected = this.mtwoControlTowerConfigurationDataService.getSelectedEntity();
			if (selected) {
				return {
					Id: selected.Id,
					filter:''
				};
			}
			return {
				Id: null,
				filter:''
			};
	}

	protected override onLoadByFilterSucceeded(loaded: ITowerConfigurationPermissionsResponse) : ISearchResult<IMtwoPowerbiItemEntity>{
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: []
			},
			dtos: loaded.Reports
		};
	}

} 
