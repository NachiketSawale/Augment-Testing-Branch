/*
 * Copyright(c) RIB Software GmbH
 */

import { getCustomDialogDataToken } from '@libs/ui/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { currentType } from '../../services/helper/procurement-common-currency-exchange-rate.service';

/**
 * Specify currency component,  ForeignCurrency or HomeCurrency
 */
@Component({
	selector: 'procurement-common-specify-currency',
	templateUrl: './specify-currency.component.html',
	styleUrls: ['./specify-currency.component.scss'],
})
export class ProcurementCommonSpecifyCurrencyComponent implements OnDestroy {
	private readonly dialogWrapper = inject(getCustomDialogDataToken<currentType, ProcurementCommonSpecifyCurrencyComponent>());
	public readonly homeCurrencyStr: currentType = 'HomeCurrency';
	public readonly foreignCurrencyStr: currentType = 'ForeignCurrency';

	/**
	 * Specify ForeignCurrency or HomeCurrency, default is ForeignCurrency
	 */
	public specifyCurrency: currentType = this.foreignCurrencyStr;

	/**
	 * Is loading
	 */
	public isLoading: boolean = false;

	/**
	 * Loading
	 */
	public showLoadingIcon() {
		this.isLoading = true;
	}

	/**
	 * Close Dialog
	 * @param closeButtonId
	 */
	public closeDialog(closeButtonId?: string) {
		this.dialogWrapper.value = this.specifyCurrency;
		this.dialogWrapper.close(closeButtonId);
	}

	/**
	 * On destroy
	 */
	public ngOnDestroy() {
		this.isLoading = false;
	}
}