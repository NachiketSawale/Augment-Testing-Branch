import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';
import { EstimatePriceAdjustmentDataService } from './estimate-price-adjustment.data.service';
import { ItemType } from '@libs/ui/common';
import { IEstPriceAdjustmentItemData } from '@libs/estimate/interfaces';

/**
 * Service to handle behaviors related to Price Adjustment
 */
@Injectable({
	providedIn: 'root',
})
export class EstimatePriceAdjustmentBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstPriceAdjustmentItemData>, IEstPriceAdjustmentItemData> {
	/**
	 * EstimatePriceAdjustmentBehavior constructor
	 */
	public constructor(private dataService: EstimatePriceAdjustmentDataService) {}

	/**
	 * Method to call when a container is created
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IEstPriceAdjustmentItemData>): void {
		this.customizeToolbar(containerLink);
	}

	/**
	 * Private method to customize the toolbar with additional items
	 * @param containerLink
	 * @private
	 */
	private customizeToolbar(containerLink: IGridContainerLink<IEstPriceAdjustmentItemData>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.toolbarRefresh' },
				id: 'refreshPriceAdjust',
				sort: 200,
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-refresh',
				disabled: () => {
					return false;
				},
				fn: () => {
					void this.dataService.refreshAllLoaded();
				},
			},
			{
				id: 'modifyPriceAdjust',
				sort: 200,
				hideItem: false,
				type: ItemType.Item,
				caption: 'estimate.main.priceAdjust.title',
				iconClass: 'tlb-icons ico-price-adjustment',
				disabled: () => {
					return this.dataService.hasReadOnly();
				},
				fn: () => {
					//void this.dataService.getModifyPriceAdjustmentService().showDialog();
				},
			},
			{
				id: 'copyTenderPrice',
				sort: 200,
				hideItem: false,
				type: ItemType.Item,
				caption: 'estimate.main.copyTenderPrice',
				iconClass: 'tlb-icons ico-price-copy-boq',
				disabled: () => {
					return this.dataService.hasReadOnly();
				},
				fn: () => {
					void this.dataService.getSyncTenderPriceService().showDialog();
				},
			},
		]);
	}
}
