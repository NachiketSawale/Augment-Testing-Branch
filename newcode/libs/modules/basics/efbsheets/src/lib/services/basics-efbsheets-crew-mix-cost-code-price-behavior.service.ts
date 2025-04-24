/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { ICostCodeEntity } from '@libs/basics/costcodes';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';
import { BasicsEfbsheetsCrewMixCostCodePriceDataService } from './basics-efbsheets-crew-mix-cost-code-price-data.service';

export const BASICS_EFBSHEETS_CREW_MIX_COST_CODE_PRICE_BEHAVIOR_TOKEN = new InjectionToken<BasicsEfbsheetsCrewMixCostCodePriceBehavior>('basicsEfbsheetsCrewMixCostCodePriceBehavior');

@Injectable({
	providedIn: 'root',
})
export class BasicsEfbsheetsCrewMixCostCodePriceBehavior implements IEntityContainerBehavior<IGridContainerLink<ICostCodeEntity>, ICostCodeEntity> {
	private basicsEfbsheetsCrewMixCostCodePriceDataService = inject(BasicsEfbsheetsCrewMixCostCodePriceDataService);
	public onCreate(containerLink: IGridContainerLink<ICostCodeEntity>): void {
		this.customizeToolbar(containerLink);

		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'basics.efbsheets.updateCostCodePriceList' },
				hideItem: false,
				iconClass: ' tlb-icons ico-price-update',
				id: 'bulkEditor',
				fn: () => {
					this.basicsEfbsheetsCrewMixCostCodePriceDataService.updateCostCodesPriceList();
				},
				type: ItemType.Item
			},
		]);
	}

	private customizeToolbar(containerLink: IGridContainerLink<ICostCodeEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
	}
}
