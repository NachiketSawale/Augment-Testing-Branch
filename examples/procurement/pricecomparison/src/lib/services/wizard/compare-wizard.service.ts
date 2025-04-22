/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { CellChangeEvent, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementPricecomparisonCompareExportService } from '../export/compare-export.service';
import { ProcurementPricecomparisonRfqHeaderDataService } from '../rfq-header-data.service';
import { ProcurementPricecomparisonContractWizardService } from './contract-wizard.service';
import { CustomCompareColumnComposite, EvaluatedItemHandleMode, ReqHeaderComposite } from '../../model/entities/wizard/custom-compare-column-composite.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareWizardService {
	private readonly httpSvc = inject(PlatformHttpService);
	private readonly msgDlg = inject(UiCommonMessageBoxService);
	private readonly exportSvc = inject(ProcurementPricecomparisonCompareExportService);
	private readonly rfqSvc = inject(ProcurementPricecomparisonRfqHeaderDataService);
	private readonly contractWizard = inject(ProcurementPricecomparisonContractWizardService);

	/**
	 * Export BoQ & Item container to excel
	 */
	public async exportExcel() {
		return this.exportSvc.exportExcel();
	}

	/**
	 * Create Contract
	 */
	public async createContract() {
		if (!this.rfqSvc.hasSelection()) {
			return this.msgDlg.showInfoBox('procurement.pricecomparison.wizard.info.noHeader', 'pc_create_contract', false);
		}

		const rfqId = this.rfqSvc.getSelectedRfqId();
		return this.contractWizard.showCreateContractWizardDialog({
			verify: async () => {
				const quotes = await this.contractWizard.load();
				if (quotes.length === 0) {
					await this.msgDlg.showInfoBox('procurement.pricecomparison.wizard.info.noQuoteData', 'pc_create_contract', false);
					return false;
				}
				return true;
			},
			loadOptions: async () => {
				await this.httpSvc.get<boolean>('procurement/pricecomparison/boq/isexqtnevaluated?rfqId=' + rfqId);
				return {
					showContractNote: true,
					hasChangeOrder: this.rfqSvc.isSelectedItemHasChangeOrder(),
					evaluatedItemHandleMode: EvaluatedItemHandleMode.Takeover, // res ? EvaluatedItemHandleMode.Takeover : EvaluatedItemHandleMode.Takeover, // TODO-DRIZZLE: The old AngularJS seems always TakeOver?
					items: this.contractWizard.getList(),
					onRequisitionCellChanged: async (evt: CellChangeEvent<ReqHeaderComposite>) => {
						if (evt.column.id === 'isChecked') {
							this.contractWizard.updateSelectedReqHeaderIds(evt.item);
						}
						return Promise.resolve({status: true});
					},
					onSelectChanged: (selectedItem: CustomCompareColumnComposite) => {
						this.contractWizard.getSelectedReqHeaderIds([]);
						this.contractWizard.clearSelectedReqHeaderId2ReqVariantIdsMap();
						return this.contractWizard.setSelectedQuote(selectedItem);
					},
					getAllReqHeaders: (selectedItem: CustomCompareColumnComposite, items: CustomCompareColumnComposite[]) => {
						return Promise.resolve(this.contractWizard.getAllReqHeaders());
					}
				};
			}
		});
	}
}