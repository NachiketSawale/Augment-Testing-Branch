/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { IInvHeaderEntity, InvComplete } from '../model';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoicePrepareSelectionTransactionWizardService extends ProcurementCommonWizardBaseService<IInvHeaderEntity, InvComplete, object> {
	public constructor(protected invDataService: ProcurementInvoiceHeaderDataService) {
		super({ rootDataService: invDataService });
	}

	protected override async showWizardDialog() {
		const invSelectedIds = this.invDataService.getSelectedIds().map((e) => e.id);
		if (invSelectedIds) {
			this.wizardUtilService.showLoadingDialog('procurement.invoice.transaction.generalTransaction');
			try {
				const responseData = await this.http.post('procurement/invoice/transaction/prepare', { MainItemIds: invSelectedIds });
				if (!responseData) {
					await this.messageBoxService.showMsgBox('procurement.invoice.transaction.finishedGeneralTransaction', 'procurement.invoice.transaction.generalInformation', 'ico-info');
				}
			} catch (e) {
				await this.messageBoxService.showErrorDialog(e as string);
			} finally {
				this.wizardUtilService.closeLoadingDialog();
			}
		}
		return undefined;
	}
}
