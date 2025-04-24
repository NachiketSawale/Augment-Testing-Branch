/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IBidCertificateEntity, IBidHeaderEntity } from '@libs/sales/interfaces';
import { BidHeaderComplete } from '../model/complete-class/bid-header-complete.class';
import { SalesBidBidsDataService } from './sales-bid-bids-data.service';

@Injectable({
	providedIn: 'root'
})

/**
 * Sales bid Certificate data service
 */
export class SalesBidCertificateDataService extends DataServiceFlatLeaf<IBidCertificateEntity, IBidHeaderEntity, BidHeaderComplete>{

	public constructor(dataService: SalesBidBidsDataService) {
		const options: IDataServiceOptions<IBidCertificateEntity>  = {
			apiUrl: 'sales/bid/certificate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
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
                    return { pKey1 : ident.pKey1!};
                }
			},
			roleInfo: <IDataServiceChildRoleOptions<IBidCertificateEntity,IBidHeaderEntity, BidHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BidCertificate',
				parent: dataService,
			},
		};

		super(options);
	}
	
	public override isParentFn(parentKey: IBidHeaderEntity, entity: IBidCertificateEntity): boolean {
		return entity.HeaderFk === parentKey.Id;
	}
}