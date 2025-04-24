/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';
import { BilHeaderComplete } from '../model/complete-class/bil-header-complete.class';
import { IBilHeaderEntity, IPaymentEntity } from '@libs/sales/interfaces';


@Injectable({
	providedIn: 'root',
})

/**
 * Sales billing payment data service
 */
export class SalesBillingPaymentDataService extends DataServiceFlatLeaf<IPaymentEntity, IBilHeaderEntity, BilHeaderComplete> {
	public constructor(dataService: SalesBillingBillsDataService) {
		const options: IDataServiceOptions<IPaymentEntity> = {
			apiUrl: 'sales/billing/payment',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return { 
						pKey1: ident.pKey1!,
						filter: ''
					};
				}
			},
			createInfo: {
				prepareParam: (ident) => {
                    return { pKey1 : ident.pKey1! };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IPaymentEntity, IBilHeaderEntity, BilHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BilPayment',
				parent: dataService,
			},
		};

		super(options);
	}
	public override isParentFn(parentKey: IBilHeaderEntity, entity: IPaymentEntity): boolean {
		return entity.BilHeaderFk === parentKey.Id;
	}
}
