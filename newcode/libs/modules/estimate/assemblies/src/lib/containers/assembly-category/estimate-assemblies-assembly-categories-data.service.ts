/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { EstAssemblyCatComplete } from '../../model/models';
import { ISearchResult } from '@libs/platform/common';
import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';

/*
 * Service to handle data operations for the assembly category in assemblies
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateAssembliesAssemblyCategoriesDataService extends DataServiceHierarchicalRoot<IEstAssemblyCatEntity, EstAssemblyCatComplete> {
	public constructor() {
		const options: IDataServiceOptions<IEstAssemblyCatEntity> = {
			apiUrl: 'estimate/assemblies/structure',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtertree',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IEstAssemblyCatEntity>>{
				role: ServiceRole.Root,
				itemName: 'AssemblyCategories',
			},
		};
		super(options);
	}

	/*
	 * Provide payload for loading data by filter
	 */
	protected override provideLoadByFilterPayload(): object {
		const filter = {
			IsPrjAssembly: false,
			IsShowInLeading: false,
		};
		return filter;
	}

	/*
	 * Process loaded data when loading by filter succeeds
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IEstAssemblyCatEntity> {
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: [0],
			},
			dtos: loaded as IEstAssemblyCatEntity[],
		};
	}
}
