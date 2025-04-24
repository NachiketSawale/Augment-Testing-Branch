/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { ICostCodeNewEntity } from '../model/entities/cost-code-new-entity.interface';
import { PpsCostCodesComplete } from '../model/pps-cost-codes-complete.class';
import { ISearchResult } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class PpsCostCodesDataService extends DataServiceHierarchicalRoot<ICostCodeNewEntity, PpsCostCodesComplete> {
	public constructor() {
		const options: IDataServiceOptions<ICostCodeNewEntity> = {
			apiUrl: 'productionplanning/ppscostcodes',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false,
			},
			roleInfo: <IDataServiceRoleOptions<ICostCodeNewEntity>>{
				role: ServiceRole.Root,
				itemName: 'CostCodes',
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};

		super(options);
	}

	public override supportsSidebarSearch(): boolean {
		return false;
	}

	public override createUpdateEntity(modified: ICostCodeNewEntity | null): PpsCostCodesComplete {
		const complete = new PpsCostCodesComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.CostCodes = [modified];
		}

		return complete;
	}

	/**
	 * Processes the successful loading of cost code entities filtered by specific criteria.
	 * @param loaded The loaded object containing the filtered cost code entities.
	 *
	 * @returns An `ISearchResult<ICostCodeEntity>` object containing the filtered cost code entities and default filter results.
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<ICostCodeNewEntity> {
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: [],
			},
			dtos: loaded as ICostCodeNewEntity[],
		};
	}
}
