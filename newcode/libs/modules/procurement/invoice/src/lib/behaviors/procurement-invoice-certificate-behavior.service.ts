/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Subscription } from 'rxjs';
import { IPrcCertificateEntity } from '@libs/procurement/interfaces';
import { ItemType } from '@libs/ui/common';
import { ProcurementInvoiceCertificateDataService } from '../services/procurement-invoice-certificate-data.service';

export const PROCUREMENT_INVOICE_CERTIFICATE_BEHAVIOR_TOKEN = new InjectionToken<ProcurementInvoiceCertificateBehavior>('procurementPesTransactionBehavior');

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceCertificateBehavior implements IEntityContainerBehavior<IGridContainerLink<IPrcCertificateEntity>, IPrcCertificateEntity> {

	public constructor(public dataService: ProcurementInvoiceCertificateDataService) {

	}

	private subscriptions: Subscription[] = [];

	public onCreate(containerLink: IGridContainerLink<IPrcCertificateEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord]);

		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.desktop.navBarRefreshDesc' },
				iconClass: 'tlb-icons ico-refresh',
				id: 'refresh',
				sort: 8,
				disabled: () => {
					return !this.dataService.getSelectedEntity();
				},
				fn: () => {
					this.dataService.refresh();
				},
				type: ItemType.Item
			}
		]);
	}

	public onDestroy(containerLink: IGridContainerLink<IPrcCertificateEntity>): void {
		this.subscriptions.forEach((sub) => {
			sub.unsubscribe();
		});
	}
}