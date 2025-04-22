/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';
import { BilHeaderComplete } from '../model/complete-class/bil-header-complete.class';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IBilHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root',
})
/**
 * Sales Billing Chained Invoices (Previous Bills) Data Service
 */
export class SalesBillingPreviousBillsDataService extends DataServiceFlatLeaf<IBilHeaderEntity, IBilHeaderEntity, BilHeaderComplete> {
	public constructor(private readonly salesBillingBillDataSvc: SalesBillingBillsDataService) {
		const options: IDataServiceOptions<IBilHeaderEntity> = {
			apiUrl: 'sales/billing',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'previousbills',
				usePost: false,
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1,
					};
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IBilHeaderEntity, IBilHeaderEntity, BilHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Bil2bil',
				parent: salesBillingBillDataSvc,
			},
			entityActions: {
                deleteSupported: false,
                createSupported: false
            }
		};
		super(options);
	}
}
