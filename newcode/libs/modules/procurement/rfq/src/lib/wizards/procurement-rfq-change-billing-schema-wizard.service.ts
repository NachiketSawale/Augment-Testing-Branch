/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementRfqHeaderMainDataService } from '../services/procurement-rfq-header-main-data.service';
import { UiCommonMessageBoxService, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { PlatformHttpService } from '@libs/platform/common';
import { RfqChangeBillingSchemaWizardComponent } from '../components/rfq-change-billing-schema-wizard/rfq-change-billing-schema-wizard.component';
import { IRfqHeaderEntity, IQuoteHeaderEntity } from '@libs/procurement/interfaces';
import { Observable } from 'rxjs';

export interface IChangeBillingSchemaEntity {
	selectedQuote: IQuoteHeaderEntity;
	quoteHeaders: IQuoteHeaderEntity[];
	rfqHeader: IRfqHeaderEntity;
}

/**
 * Service for handling billing schema changes in Procurement RFQ.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRfqChangeBillingSchemaService {
	/**
	 * To inject procurementRfqMainService
	 */
	public readonly procurementRfqMainService = inject(ProcurementRfqHeaderMainDataService);
	/**
	 * To inject UiCommonMessageBoxService
	 */
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	/**
	 * To inject PlatformHttpService
	 */
	public readonly http = inject(PlatformHttpService);
	/**
	 * To inject UiCommonDialogService
	 */
	public readonly modalDialogService = inject(UiCommonDialogService);
	/**
	 * To inject ProcurementQuoteHeaderDataService
	 */
	// public quoteHeaderDataService = inject(ProcurementQuoteHeaderDataService);
	// public qtnBillingSchemaService = inject(ProcurementQuoteBillingSchemaDataService);

	public readonly translatePrefix = 'procurement.rfq.wizard.';
	public mainItem: IRfqHeaderEntity | null = null;

	/**
	 * Initiates the billing schema change process.
	 * @returns
	 */
	public async changeBillingSchema() {
		this.mainItem = this.procurementRfqMainService.getSelectedEntity();

		if (!this.mainItem || Object.keys(this.mainItem).length === 0) {
			this.showDialog(this.translatePrefix + 'create.quote.selected');
			return;
		}

		const oldBillingSchemaId = this.mainItem?.BillingSchemaFk;

		const result = await this.modalDialogService.show({
			resizeable: true,
			backdrop: false,
			headerText: this.translatePrefix + 'changeBillingSchema',
			bodyComponent: RfqChangeBillingSchemaWizardComponent,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'ui.common.dialog.okBtn' },
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],
			value: { BillingSchemaFk: this.mainItem?.BillingSchemaFk },
		});

		if (result && result.closingButtonId === StandardDialogButtonId.Ok) {
			this.updateBillingSchema(oldBillingSchemaId);
		}
	}

	/**
	 * Updates the billing schema with the new value.
	 */
	private updateBillingSchema(oldBillingSchemaId: number | undefined) {
		this.changeBillingSchema$().subscribe(
			(response: IChangeBillingSchemaEntity) => {
				if (this.mainItem && response.rfqHeader) {
					Object.assign(this.mainItem, response.rfqHeader);
					this.procurementRfqMainService.update(this.mainItem);
					this.procurementRfqMainService.refreshAll();
				}

			//Todo: TODO: The `quoteHeaderDataService` is required but would create a circular dependency.
			// const quoteSelected = this.quoteHeaderDataService.getSelectedEntity();
			// if (response.quoteHeaders) {
			// 	const quoteListData = this.quoteHeaderDataService.getList();
			// 	response.quoteHeaders.forEach((header) => {
			// 		const qtnTemp = quoteListData.find((qtn) => qtn.Id === header.Id);
			// 		if (qtnTemp) {
			// 			Object.assign(qtnTemp, header);
			// 		}
			// 	});
			// 	this.quoteHeaderDataService.refreshAll();
			// }
			},
			() => {
				if (this.mainItem) {
					this.mainItem.BillingSchemaFk = oldBillingSchemaId;
				}
			}
		);
	}

	/**
	 * Displays a dialog message.
	 * @param {string} messageKey
	 */
	private showDialog(messageKey: string): void {
		this.messageBoxService.showMsgBox(messageKey, this.translatePrefix + 'create.quote.title', 'ico-info');
	}

	/**
	 * Fetches updated billing schema data from the server.
	 * @returns {Observable<IQuoteData>}
	 */
	private changeBillingSchema$(): Observable<IChangeBillingSchemaEntity> {
		const params = {
			rfqHeaderId: this.mainItem?.Id || -1,
			billingSchemaId: this.mainItem?.BillingSchemaFk || -1,
			selectedQtnId: -1, // TODO: Fix circular dependency before enabling quoteSelected.Id || -1
		};
		return this.http.get$<IChangeBillingSchemaEntity>('procurement/quote/header/changeBillingSchema', { params: params });
	}
}
