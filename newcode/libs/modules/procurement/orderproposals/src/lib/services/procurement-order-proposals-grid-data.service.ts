/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ProcurementOrderProposalsGridComplete } from '../model/procurement-order-proposals-grid-complete.class';
import { ISearchResult } from '@libs/platform/common';
import { IFilterResponse } from '@libs/basics/shared';
import { IOrderProposalEntity } from '../model/entities/order-proposal-entity.interface';

export interface IOrderProposalLoadedEntity {
	FilterResult: IFilterResponse;
	Main: IOrderProposalEntity[];
}

@Injectable({
	providedIn: 'root'
})

/**
 * The Data service for ProcurementOrderProposals container
 */
export class ProcurementOrderProposalsGridDataService extends DataServiceFlatRoot<IOrderProposalEntity, ProcurementOrderProposalsGridComplete> {
	public allUniqueColumns: string[] = [];
	public constructor() {
		const options: IDataServiceOptions<IOrderProposalEntity> = {
			apiUrl: 'procurement/orderproposals/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getlist',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deleteorderproposal' 
			},
			roleInfo: <IDataServiceRoleOptions<IOrderProposalEntity>>{
				role: ServiceRole.Root,
				itemName: 'OrderProposals',
			},
			
		};

		super(options);
	}
	public override createUpdateEntity(modified: IOrderProposalEntity | null): ProcurementOrderProposalsGridComplete {
		const complete = new ProcurementOrderProposalsGridComplete();
		if (modified !== null ) {
			complete.Id = modified.Id as number ;
			complete.OrderProposals = [modified];
		}
		return complete;
	}

	protected override onLoadByFilterSucceeded(loaded: IOrderProposalLoadedEntity): ISearchResult<IOrderProposalEntity> {
		const filterResult = loaded.FilterResult;
		return {
			dtos: loaded.Main,
			FilterResult: {
				ExecutionInfo: filterResult.ExecutionInfo,
				ResultIds: filterResult.ResultIds,
				RecordsFound: filterResult.RecordsFound,
				RecordsRetrieved: filterResult.RecordsRetrieved
			}
		};
	}



}







