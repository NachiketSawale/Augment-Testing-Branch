/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { CopyAdjustPriceType } from '../../containers/price-adjustment/toolbar/estimate-main-copy-adjust-price.type';

@Component({
	selector: 'estimate-main-price-adjust-copy-tender',
	templateUrl: './price-adjust-copy-tender.component.html',
	styleUrls: ['./price-adjust-copy-tender.component.scss'],
})
export class PriceAdjustCopyTenderComponent {
	public currentItem: CopyAdjustPriceType = {
		copyTenderPriceToBoqItem: true,
		copyAQQuantityToBoqItem: true,
		copyTenderPriceToLineItem: true,
	};

	public constructor() {}

	public copyTenderPriceToBoqItemChange() {
		if (!this.currentItem.copyTenderPriceToBoqItem) {
			this.currentItem.copyAQQuantityToBoqItem = false;
		}
	}
}
