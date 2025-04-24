/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IInvHeaderEntity, IInvTransactionIcEntity } from '../model/entities';
import { InvComplete } from '../model';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
@Injectable({
	providedIn: 'root'
})

/**
 * Invoice Ic Transaction data service
 */
export class ProcurementInvoiceIcTransactionDataService extends DataServiceFlatLeaf<IInvTransactionIcEntity, IInvHeaderEntity, InvComplete>{

	public constructor(parentService:ProcurementInvoiceHeaderDataService) {
		const options: IDataServiceOptions<IInvTransactionIcEntity>  = {
			apiUrl: 'procurement/invoice/ictransaction',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IInvTransactionIcEntity,IInvHeaderEntity, InvComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'InvIcTransaction',
				parent: parentService,
			},
			entityActions: { createSupported: false, deleteSupported: false },

		};
		super(options);
	}
	
}

		
			





