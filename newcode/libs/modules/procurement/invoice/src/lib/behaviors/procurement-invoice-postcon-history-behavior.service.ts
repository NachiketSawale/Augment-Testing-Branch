/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IInvHeaderEntity } from '../model/entities';
import { BasicsSharedPostConHistoryBehavior, IBasicsSharedPostConHistoryEntity } from '@libs/basics/shared';
import { InvComplete } from '../model';
import { ProcurementInvoicePostConHistoryDataService } from '../services/procurement-invoice-postcon-history-data.service';

export const PROCUREMENT_INVOICE_POST_CON_HISTORY_BEHAVIOR_TOKEN = new InjectionToken<ProcurementInvoicePostConHistoryBehavior>('procurementInvoicePostConHistoryBehavior');

/**
 * Procurement PostCon History item behavior for inv
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementInvoicePostConHistoryBehavior extends BasicsSharedPostConHistoryBehavior<IBasicsSharedPostConHistoryEntity, IInvHeaderEntity, InvComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		super(inject(ProcurementInvoicePostConHistoryDataService));
	}
}