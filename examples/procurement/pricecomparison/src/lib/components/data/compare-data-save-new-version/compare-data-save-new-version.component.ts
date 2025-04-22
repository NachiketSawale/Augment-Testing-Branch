/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { FieldType, getCustomDialogDataToken, IAdditionalSelectOptions } from '@libs/ui/common';
import { PropertyType } from '@libs/platform/common';

@Component({
	selector: 'procurement-pricecomparison-compare-data-new-version',
	templateUrl: './compare-data-save-new-version.component.html',
	styleUrls: ['./compare-data-save-new-version.component.scss'],
})
export class ProcurementPricecomparisonCompareDataSaveNewComponent {
	private readonly dlgWrapper = inject(getCustomDialogDataToken<boolean, ProcurementPricecomparisonCompareDataSaveNewComponent>());
	public fieldType = FieldType;
	public options: IAdditionalSelectOptions<string> = {
		itemsSource: {
			items: [{
				id: 'false',
				displayName: {key: 'procurement.pricecomparison.onlySaveModified'}
			}, {
				id: 'true',
				displayName: {key: 'procurement.pricecomparison.saveAllQuote'}
			}]
		}
	};

	public get selectedValue() {
		return this.dlgWrapper.value ? 'true' : 'false';
	}

	public onOptionChanged(value: PropertyType) {
		this.dlgWrapper.value = value === 'true';
	}
}
