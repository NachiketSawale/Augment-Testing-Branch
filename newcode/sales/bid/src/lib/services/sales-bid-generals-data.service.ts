/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { IBidGeneralsEntity, IBidHeaderEntity, IBilHeaderEntity } from '@libs/sales/interfaces';
import { BidHeaderComplete } from '../model/complete-class/bid-header-complete.class';
import { SalesBidBidsDataService } from './sales-bid-bids-data.service';


@Injectable({
    providedIn: 'root'
})

/**
 * Sales Bid Generals data service
 */
export class SalesBidGeneralsDataService extends DataServiceFlatLeaf<IBidGeneralsEntity, IBilHeaderEntity, BidHeaderComplete> {

    public constructor(dataService: SalesBidBidsDataService) {
        const options: IDataServiceOptions<IBidGeneralsEntity> = {
            apiUrl: 'sales/bid/generals',
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
            createInfo:{
                prepareParam: ident => {
                    return { pKey1 : ident.pKey1! };
                }
            },
            roleInfo: <IDataServiceChildRoleOptions<IBidGeneralsEntity, IBidHeaderEntity, BidHeaderComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'Generals',
                parent: dataService
            }
        };

        super(options);
    }
    
    public override isParentFn(parentKey: IBidHeaderEntity, entity: IBidGeneralsEntity): boolean {
		return entity.BidHeaderFk === parentKey.Id;
	}
}