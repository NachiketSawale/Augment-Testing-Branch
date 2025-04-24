/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IBidHeaderEntity, IBidMilestoneEntity } from '@libs/sales/interfaces';
import { SalesBidBidsDataService } from './sales-bid-bids-data.service';
import { BidHeaderComplete } from '../model/complete-class/bid-header-complete.class';

@Injectable({
	providedIn: 'root'
})

/**
 * Sales bid Milestones data service
 */
export class SalesBidMilestonesDataService extends DataServiceFlatLeaf<IBidMilestoneEntity, IBidHeaderEntity, BidHeaderComplete> {

	public constructor(dataService: SalesBidBidsDataService) {
		const options: IDataServiceOptions<IBidMilestoneEntity> = {
			apiUrl: 'sales/bid/milestone',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
                    return { 
						pKey1 : ident.pKey1!,
						filter: ''
					};
                }
			},
			createInfo: {
				prepareParam: ident => {
					return { pKey1 : ident.pKey1! };
				}
			},
            roleInfo: <IDataServiceChildRoleOptions<IBidMilestoneEntity, IBidHeaderEntity, BidHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BidMilestone',
				parent: dataService
			}
		};

		super(options);
	}

	public override isParentFn(parentKey: IBidHeaderEntity, entity: IBidMilestoneEntity): boolean {
		return entity.BidHeaderFk === parentKey.Id;
	}

}
