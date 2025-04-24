/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';
import { BilHeaderComplete } from '../model/complete-class/bil-header-complete.class';
import { get } from 'lodash';
import { IAccrualEntity, IBilHeaderEntity } from '@libs/sales/interfaces';
/**
 * Sales Billing Accrual Data Service
 */
@Injectable({
	providedIn: 'root',
})
export class SalesBillingAccrualDataService extends DataServiceFlatLeaf<IAccrualEntity, IBilHeaderEntity, BilHeaderComplete> {
	public constructor(private parentDataService: SalesBillingBillsDataService) {
		const options: IDataServiceOptions<IAccrualEntity> = {
			apiUrl: 'sales/billing/accrual',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<IAccrualEntity, IBilHeaderEntity, BilHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BilAccrual',
				parent: parentDataService,
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false,
			},
		};
		super(options);
	}
	protected override provideLoadPayload(): object {
		const selected = this.parentDataService.getSelectedEntity();
		return {
			mainItemId: selected?.Id,
		};
	}
	protected override onLoadSucceeded(loaded: object): IAccrualEntity[] {
		if (loaded) {
			return get(loaded, 'Main', []);
		}
		return [];
	}
}