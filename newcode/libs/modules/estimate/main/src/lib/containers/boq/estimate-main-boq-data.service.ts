/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { ISearchResult } from '@libs/platform/common';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { get } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainBoqDataService extends DataServiceHierarchicalRoot<IBoqItemEntity, IBoqItemEntity> {

	public constructor() {
		const options: IDataServiceOptions<IBoqItemEntity> = {
			apiUrl: 'boq/project',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getboqcompositelist',
				usePost: false
			},
			roleInfo: <IDataServiceRoleOptions<IBoqItemEntity>>{
				role: ServiceRole.Root,
				itemName: 'BoqItem'
			}
		};
		super(options);
	}

	protected override provideLoadByFilterPayload(): object {
		//TODO: 'getSelectedProjectId()' will be added.
		const projectId = 1015580;
		return {
			projectId: projectId
		};
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IBoqItemEntity> {
		const data = get(loaded, 'dtos')!;
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: []
			},
			dtos: data
		};
	}
}

