/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { getCustomDialogDataToken } from '@libs/ui/common';
import { IConHeaderEntity } from '@libs/procurement/interfaces';
import { PlatformTranslateService } from '@libs/platform/common';

@Component({
	selector: 'procurement-pricecomparison-create-contract-result',
	templateUrl: './create-contract-result.component.html',
	styleUrls: ['./create-contract-result.component.scss'],
})
export class ProcurementPricecomparisonCreateContractResultComponent {
	private readonly translateSvc = inject(PlatformTranslateService);
	private readonly dlgWrapper = inject(getCustomDialogDataToken<IConHeaderEntity[], ProcurementPricecomparisonCreateContractResultComponent>());

	public get contracts() {
		return this.dlgWrapper.value as IConHeaderEntity[];
	}

	public getNewCodeDisplayText() {
		return this.translateSvc.instant('procurement.pricecomparison.wizard.create.contract.newCode', {newCode: this.contracts.map(e => e.Code).join(', ')}).text;
	}
}
