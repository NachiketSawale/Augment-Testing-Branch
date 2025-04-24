/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceHierarchicalNode,IDataServiceRoleOptions,ServiceRole,IDataServiceEndPointOptions,IDataServiceOptions} from '@libs/platform/data-access';
import { InvAccrualComplete } from '../model/inv-accrual-complete.class';
import { IInvoiceAccrualEntity } from '../model/entities/invoice-accrual-entity.interface';
import { IInvHeaderEntity, InvComplete } from '../model';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';


@Injectable({
	providedIn: 'root'
})

/**
 * Procurement Invoice Accrual Grid Data Service.
 */
export class ProcurementInvoiceAccrualGridDataService extends DataServiceHierarchicalNode<IInvoiceAccrualEntity,InvAccrualComplete,IInvHeaderEntity, InvComplete>{
	public constructor(protected parentDataService : ProcurementInvoiceHeaderDataService) {
		const options: IDataServiceOptions<IInvoiceAccrualEntity>  = {
			apiUrl: 'procurement/invoice/accrual',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceRoleOptions<IInvoiceAccrualEntity>>{
				role: ServiceRole.Node,
				itemName: 'CompanyTransaction',
				parent: parentDataService,
			},	
		};
		super(options);
	}
	protected override provideLoadPayload(): object {
		const selection = this.getSelectedParent();
		if (selection) {
			return { mainItemId: selection.Id };
		}
		return { mainItemId: 0 };
	}

	protected override onLoadSucceeded(loaded: object): IInvoiceAccrualEntity[] {
		return loaded as IInvoiceAccrualEntity[];
	}

}

