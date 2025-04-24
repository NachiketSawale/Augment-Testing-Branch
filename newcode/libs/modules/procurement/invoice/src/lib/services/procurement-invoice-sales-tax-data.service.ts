/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { IInvHeaderEntity, InvComplete } from '../model';
import { IProcurementCommonSalesTaxEntity, ProcurementCommonSalesTaxDataService } from '@libs/procurement/common';

@Injectable({
	providedIn: 'root'
})
export class ProcurementInvoiceSalesTaxDataService extends ProcurementCommonSalesTaxDataService<IProcurementCommonSalesTaxEntity, IInvHeaderEntity, InvComplete> {

	public constructor(protected override readonly parentService: ProcurementInvoiceHeaderDataService) {
		super(parentService);
	}
}