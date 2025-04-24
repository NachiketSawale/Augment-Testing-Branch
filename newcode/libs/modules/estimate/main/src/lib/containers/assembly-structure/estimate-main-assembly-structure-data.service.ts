/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';
import { ISearchResult } from '@libs/platform/common';
import { EstAssemblyCatComplete } from '@libs/estimate/assemblies';


/*
 * Service to handle data operations for the main assembly structure in estimates
 */
@Injectable({
	providedIn: 'root'
})
export class EstimateMainAssemblyStructureDataService extends DataServiceHierarchicalRoot<IEstAssemblyCatEntity, EstAssemblyCatComplete> {
	private constructor() {
		const options: IDataServiceOptions<IEstAssemblyCatEntity> = {
			apiUrl: 'estimate/assemblies/structure',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'treeForLookup',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IEstAssemblyCatEntity>>{
				role: ServiceRole.Root,
				itemName: 'AssemblyStructure'
			}
		};
		super(options);
	}

	// todo dyanamic data loading
	// depends on platformDataServiceFactory, ServiceDataProcessArraysExtension, estimateAssembliesStructureImageProcessor, estimateMainFilterService, estimateMainFilterCommon,
	//			estimateMainService, estimateMainCreationService, estimateProjectRateBookConfigDataService, estMainRuleParamIconProcess

	/*
	 * Provide payload for loading data by filter
	 */
	protected override provideLoadByFilterPayload(): object {
		const filter = {
			filter: '',
			IsShowInLeading: 1
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
				ResultIds: []
			},
			dtos: loaded as IEstAssemblyCatEntity[]
		};
	}
}
