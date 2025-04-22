/*
 * Copyright(c) RIB Software GmbH
 */
import { AfterViewInit, Component, inject } from '@angular/core';
import { ProcurementInvoiceValidationGridDataService } from '../../services/procurement-invoice-validation-grid-data.service';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { PrcInvoiceMsgComponent } from '../prc-invoice-msg/prc-invoice-msg.component';

@Component({
	selector: 'procurement-invoice-validations-message-lookup',
	templateUrl: './procurement-invoice-validations-message-lookup.component.html',
	styleUrl: './procurement-invoice-validations-message-lookup.component.css',
})
export class ProcurementInvoiceValidationsMessageLookupComponent implements AfterViewInit {
	public messages!: string;
	private parentDataService = inject(ProcurementInvoiceValidationGridDataService);
	private modalDialogService = inject(UiCommonDialogService);

	public ngAfterViewInit(): void {
		this.parentDataService.selectionChanged$.subscribe(() => {
			const selectedEntities = this.parentDataService.getSelectedEntity()?.Message;
			if (selectedEntities) {
				this.messages = selectedEntities;
			}
		});
	}

	public async showMessage() {
		this.parentDataService.sendMessages(this.messages);
		const modalOptions: ICustomDialogOptions<{ text: string }, PrcInvoiceMsgComponent> = {
			width: '50',
			resizeable: true,
			backdrop: false,
			headerText: { key: 'procurement.invoice.message' },
			bodyComponent: PrcInvoiceMsgComponent,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'ui.common.dialog.okBtn' },
					autoClose: true,
				},
			],
		};
		await this.modalDialogService.show(modalOptions);
	}
}
