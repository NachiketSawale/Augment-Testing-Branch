/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import {  IInvHeaderEntity } from '../model/entities';
import { BasicsSharedPostConHistoryDataService, IBasicsSharedPostConHistoryEntity } from '@libs/basics/shared';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { InvComplete } from '../model';


export const PROCUREMENT_INVOICE_POST_CON_HISTORY_DATA_TOKEN = new InjectionToken<ProcurementInvoicePostConHistoryDataService>('procurementInvoicePostConHistoryDataService');


/**
 * post con history service in inv
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementInvoicePostConHistoryDataService extends BasicsSharedPostConHistoryDataService<IBasicsSharedPostConHistoryEntity,IInvHeaderEntity, InvComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementInvoiceHeaderDataService);
		super(parentService);
	}

	public getParentId(parent:IInvHeaderEntity){
		return{
			invoiceId: parent.Id
		};
	}


}