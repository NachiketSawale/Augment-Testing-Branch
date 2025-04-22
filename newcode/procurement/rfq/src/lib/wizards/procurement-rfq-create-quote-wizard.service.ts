/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, of, takeUntil } from 'rxjs';

import { IEditorDialogResult } from '@libs/ui/common';
import { ICreateQuoteEntity, IQuoteItem, IQuoteResponse, IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { ProcurementCommonCreateItemWizardService } from '@libs/procurement/common';

import { ProcurementRfqHeaderMainDataService } from '../services/procurement-rfq-header-main-data.service';

/**
 * Procurement Rfq Create Quote Wizard Service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRfqCreateQuoteWizardService extends ProcurementCommonCreateItemWizardService {
	/**
	 * To inject ProcurementRfqHeaderMainDataService
	 */
	private readonly procurementRfqMainService = inject(ProcurementRfqHeaderMainDataService);
	public quoteHeaderIds: number[] = [];
	public quoteHeaderCodes: string[] = [];

	/**
	 * Method used to create quote wizards from rfq module
	 */
	public createQuote(): void {
		const mainItem = this.procurementRfqMainService.getSelectedEntity();

		if (!mainItem || Object.getOwnPropertyNames(mainItem).length === 0) {
			this.showDialog('procurement.rfq.wizard.create.quote.selected');
			return;
		}

		this.checkCanCreateQuote(mainItem.Id)
			.pipe(
				switchMap((canCreate) => (canCreate ? this.checkHasContractedData(mainItem.Id) : this.showNoNeedDialog())),
				switchMap((hasContractItem) => (hasContractItem !== null ? this.createQuoteItem(mainItem, hasContractItem) : of(null))),
				takeUntil(this.destroy$),
			)
			.subscribe();
	}

	/**
	 * Checks if a quote can be created.
	 * @param {number} rfqId
	 * @returns {Observable<boolean>}
	 */
	private checkCanCreateQuote(rfqId: number): Observable<boolean> {
		return this.http.post$<boolean>('procurement/rfq/header/cancreatequote', { Value: rfqId });
	}

	/**
	 * Checks if the RFQ has contracted data.
	 * @param {number} rfqId
	 * @returns {Observable<boolean>}
	 */
	private checkHasContractedData(rfqId: number): Observable<boolean> {
		const request = {
			MainItemIds: [rfqId],
			ModuleName: 'procurement.rfq',
		};
		return this.http.post$<boolean>('procurement/common/wizard/hascontracteddata', request);
	}

	/**
	 * Creates a quote item based on the RFQ.
	 * @param {IRfqHeaderEntity} mainItem
	 * @param {boolean} hasContractItem
	 * @returns {Promise<IEditorDialogResult<ICreateQuoteEntity>>}
	 */
	private createQuoteItem(mainItem: IRfqHeaderEntity, hasContractItem: boolean): Promise<IEditorDialogResult<ICreateQuoteEntity>> {
		return this.createItem({
			fillSelectedItem: (quoteItem: IQuoteItem) => {
				quoteItem.RfqHeaderFk = mainItem.Id;
				quoteItem.ProjectFk = mainItem.ProjectFk;
			},
			onCreateSucceeded: (quoteResponse: IQuoteResponse[]) => this.handleQuoteResponse(quoteResponse),
			needCopyRfqTotals: true,
			isCreateByMaterials: false,
			hasContractItem: hasContractItem,
			isCreateByRfq: true,
		});
	}

	/**
	 * Handles the response after creating a quote.
	 * @param {IQuoteResponse[]} quoteResponse
	 */
	private handleQuoteResponse(quoteResponse: IQuoteResponse[]): void {
		this.quoteHeaderIds = quoteResponse.map((q) => q.QuoteHeader.Id);
		this.quoteHeaderCodes = quoteResponse.map((q) => q.QuoteHeader.Code);
	}

	/**
	 * Displays a dialog message.
	 * @param {string} messageKey
	 */
	private showDialog(messageKey: string): void {
		this.messageBoxService.showMsgBox(messageKey, 'procurement.rfq.wizard.create.quote.title', 'ico-info');
	}

	/**
	 * Shows the "no need to create quote" dialog.
	 * @returns {Observable<null>}
	 */
	private showNoNeedDialog(): Observable<null> {
		this.showDialog('procurement.rfq.wizard.create.quote.noneed');
		return of(null);
	}
}