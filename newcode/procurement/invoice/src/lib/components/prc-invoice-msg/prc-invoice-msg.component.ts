/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { ProcurementInvoiceValidationGridDataService } from '../../services/procurement-invoice-validation-grid-data.service';

@Component({
	selector: 'procurement-invoice-msg',
	templateUrl: './prc-invoice-msg.component.html',
	styleUrl: './prc-invoice-msg.component.css',
})
export class PrcInvoiceMsgComponent {
	public messages!: string;
	private parentDataService = inject(ProcurementInvoiceValidationGridDataService);

	public constructor() {
		this.parentDataService.messages$.subscribe((msg) => {
			this.messages = msg;
		});
	}
}
