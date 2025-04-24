/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IBilHeaderEntity, IItemEntity } from '@libs/sales/interfaces';
import { BilHeaderComplete } from '../model/complete-class/bil-header-complete.class';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';

@Injectable({
	providedIn: 'root'
})

/**
 * Sales billing Item container data service
 */
export class SalesBillingItemDataService extends DataServiceFlatLeaf<IItemEntity, IBilHeaderEntity, BilHeaderComplete> {

	public constructor(parentService: SalesBillingBillsDataService) {
		const options: IDataServiceOptions<IItemEntity> = {
			apiUrl: 'sales/billing/item',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						mainItemId: ident.pKey1
					};
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create'
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			roleInfo: <IDataServiceChildRoleOptions<IItemEntity, IBilHeaderEntity, BilHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BilItem',
				parent: parentService,
			},
		};
		super(options);
	}
}
