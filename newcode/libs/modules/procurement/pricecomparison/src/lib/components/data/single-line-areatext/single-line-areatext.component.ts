/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, inject } from '@angular/core';
import { ControlContextInjectionToken, FieldType, PopupService } from '@libs/ui/common';
import { POPUP_MULTI_LINE_TEXT_VALUE_TOKEN, ProcurementPricecomparisonPupupMultipleLineAreatextComponent } from '../pupup-multiple-line-areatext/pupup-multiple-line-areatext.component';

@Component({
	selector: 'procurement-pricecomparison-single-line-areatext',
	templateUrl: './single-line-areatext.component.html',
	styleUrls: ['./single-line-areatext.component.scss'],
})
export class ProcurementPricecomparisonSingleLineAreatextComponent {
	public fieldType = FieldType;
	public controlContext = inject(ControlContextInjectionToken);
	public popupSvc = inject(PopupService);

	public openPopup(e: MouseEvent) {
		const activePopup = this.popupSvc.open(new ElementRef(e.target), ProcurementPricecomparisonPupupMultipleLineAreatextComponent, {
			providers: [{
				provide: POPUP_MULTI_LINE_TEXT_VALUE_TOKEN,
				useValue: this.controlContext.value
			}]
		});

		activePopup.closed.subscribe((value: unknown) => {
			this.controlContext.value = value as string;
		});
	}
}
