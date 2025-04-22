/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { IInvHeaderEntity, IInvInvoiceImportEntity } from '../model/entities';
import { InvComplete } from '../model/inv-complete.class';
import { InvImportComplete } from '../model/inv-import-complete.class';
export const PROCUREMENT_INVOICE_IMPORT_GRID_DATA_TOKEN = new InjectionToken<ProcurementInvoiceImportDataService>('procurementInvoiceImportGridDataToken');

@Injectable({
	providedIn: 'root'
})

export class ProcurementInvoiceImportDataService extends DataServiceFlatNode<IInvInvoiceImportEntity, InvImportComplete, IInvHeaderEntity, InvComplete >{

	public constructor(parentService:ProcurementInvoiceHeaderDataService) {
		const options: IDataServiceOptions<IInvInvoiceImportEntity>  = {
			apiUrl: 'procurement/invoice',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						mainItemId: ident.pKey1!
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IInvInvoiceImportEntity,IInvHeaderEntity,InvComplete>>{
				role: ServiceRole.Node,
				itemName: 'InvInvoiceImport',
				parent: parentService,
			},
		};

		super(options);
	}
	
}



		
			





