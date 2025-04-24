/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { ISearchResult } from '@libs/platform/common';
import { IPrcConfigHeaderEntity } from '../model/entities/prc-config-header-entity.interface';
import { PrcConfigurationHeaderComplete } from '../model/complete-class/prc-configuration-header-complete.class';
import { PrcConfigurationHeaderCreateComplete } from '../model/complete-class/prc-configuration-header-create-complete.class';

export const BASICS_PROCUREMENT_CONFIGURATION_HEADER_DATA_TOKEN = new InjectionToken<BasicsProcurementConfigurationHeaderDataService>('basicsProcurementConfigurationHeaderDataToken');

/**
 * ProcurementConfiguration Header entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementConfigurationHeaderDataService extends DataServiceFlatRoot<IPrcConfigHeaderEntity, PrcConfigurationHeaderComplete> {
	public constructor() {
		const options: IDataServiceOptions<IPrcConfigHeaderEntity> = {
			apiUrl: 'basics/procurementconfiguration',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				//TODO: the procurement configuration header will be loaded without any payload. Although currently still can load the data.
				//If framework enhanced later to support loading main data without payload some followup is needed.
				//Also need solution to load the data once enter the module. maybe create a Jira ticket to framework team
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceRoleOptions<IPrcConfigHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'ProcurementConfiguration',
			},
		};

		super(options);
	}

	/**
	 * Provide the load payload here
	 * @protected
	 */
	protected override provideLoadPayload(): object {
		return {};
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IPrcConfigHeaderEntity> {
		const result = loaded as IPrcConfigHeaderEntity[];
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: result.length,
				RecordsRetrieved: result.length,
				ResultIds: [],
			},
			dtos: loaded as IPrcConfigHeaderEntity[],
		};
	}

	public override createUpdateEntity(modified: IPrcConfigHeaderEntity | null): PrcConfigurationHeaderComplete {
		return new PrcConfigurationHeaderComplete(modified);
	}

	public override getModificationsFromUpdate(complete: PrcConfigurationHeaderComplete): IPrcConfigHeaderEntity[] {
		if (complete.PrcConfigHeader === null || complete.PrcConfigHeader === undefined) {
			return [];
		}
		return [complete.PrcConfigHeader];
	}

	/**
	 *
	 * @param created
	 */
	public override onCreateSucceeded(created: PrcConfigurationHeaderCreateComplete): IPrcConfigHeaderEntity {
		if(!created.PrcConfigHeader){
			throw new Error('PrcConfigHeader is undefined');
		}
		return created.PrcConfigHeader;
		
	}
}
