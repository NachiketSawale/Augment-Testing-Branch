/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ProcurementCommonActualCertificateDataService } from '@libs/procurement/common';
import {  IInvHeaderEntity } from '../model/entities';
import { InvComplete } from '../model';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceActualCertificateDataService extends ProcurementCommonActualCertificateDataService<IInvHeaderEntity, InvComplete> {
	public constructor(protected invService: ProcurementInvoiceHeaderDataService) {
		super(invService,{
			readPoint:'listtoinvoice',
			createPoint:'createtoinvoice'
		});
	}
}