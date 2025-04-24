/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IBilHeaderEntity, ITransactionEntity } from '@libs/sales/interfaces';
import { BilHeaderComplete } from '../model/complete-class/bil-header-complete.class';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';

@Injectable({
	providedIn: 'root'
})

/**
 * Sales billing Transaction data service
 */
export class SalesBillingTransactionDataService extends DataServiceFlatLeaf<ITransactionEntity, IBilHeaderEntity, BilHeaderComplete> {

	public constructor(private salesBillingBillsDataService: SalesBillingBillsDataService) {
		const options: IDataServiceOptions<ITransactionEntity> = {
			apiUrl: 'sales/billing/transaction',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<ITransactionEntity, IBilHeaderEntity, BilHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BilTransaction',
				parent: salesBillingBillsDataService,
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};
		super(options);
	}
}