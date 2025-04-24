/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, InjectionToken, OnDestroy, inject } from '@angular/core';
import { ActivePopup, FieldType } from '@libs/ui/common';

export const POPUP_MULTI_LINE_TEXT_VALUE_TOKEN = new InjectionToken<string>('popup-multi-line-text-value');

@Component({
	selector: 'procurement-pricecomparison-pupup-multiple-line-areatext',
	templateUrl: './pupup-multiple-line-areatext.component.html',
	styleUrls: ['./pupup-multiple-line-areatext.component.scss'],
})
export class ProcurementPricecomparisonPupupMultipleLineAreatextComponent implements OnDestroy {
	public fieldType = FieldType;
	public activePopup = inject<ActivePopup>(ActivePopup);
	public textValue = inject<string>(POPUP_MULTI_LINE_TEXT_VALUE_TOKEN);

	public onValueChanged(value: string) {
		this.textValue = value;
	}

	public ngOnDestroy(): void {
		this.activePopup.close(this.textValue);
	}
}
