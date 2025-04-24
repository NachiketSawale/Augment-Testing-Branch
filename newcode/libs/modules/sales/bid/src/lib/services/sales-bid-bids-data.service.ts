/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { BidHeaderComplete } from '../model/complete-class/bid-header-complete.class';
import { IBidHeaderEntity  } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})

/**
 * Sales bid bids data service
 */
export class SalesBidBidsDataService extends DataServiceFlatRoot<IBidHeaderEntity, BidHeaderComplete> {

	public constructor() {
		const options: IDataServiceOptions<IBidHeaderEntity> = {
			apiUrl: 'sales/bid',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listfiltered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete' 
			},
			roleInfo: <IDataServiceRoleOptions<IBidHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'BidHeader',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IBidHeaderEntity | null): BidHeaderComplete {
		const complete = new BidHeaderComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.BidHeader = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: BidHeaderComplete): IBidHeaderEntity[] {
		if (complete.BidHeader === null) {
			return [];
		}

		return [complete.BidHeader];
	}

}