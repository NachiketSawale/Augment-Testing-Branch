/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { IEstCostTotalEntity } from '@libs/estimate/interfaces';
import { EstimateMainTotalDataService } from './estimate-main-total-data.service';
import { EstimateMainTotalKeyEnum } from './enum/estimate-main-total-key.enum';
import { EstimateMainTotalTranslateEnum } from './enum/estimate-main-total-translate.enum';

/**
 * Service to handle behaviors related to estimate total
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateMainTotalBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstCostTotalEntity>, IEstCostTotalEntity> {
	/**
	 * EstimateMainTotalBehavior constructor
	 */
	public constructor(private dataService: EstimateMainTotalDataService) {}

	/**
	 * Method to call when a container is created
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IEstCostTotalEntity>): void {
		this.customizeToolbar(containerLink);
	}

	/**
	 * Private method to customize the toolbar with additional items
	 * @param containerLink
	 * @private
	 */
	private customizeToolbar(containerLink: IGridContainerLink<IEstCostTotalEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 'config_total_calculatorTools',
				sort: 200,
				hideItem: false,
				type: ItemType.Sublist,
				list: {
					items: [
						{
							id: 'estimate-main-config-total-recalculate',
							hideItem: false,
							type: ItemType.Item,
							caption: 'estimate.main.dirtyRecalculate',
							iconClass: 'control-icons ico-recalculate',
							fn: () => {
								this.dataService.recalculateTotalValues(EstimateMainTotalKeyEnum.LineItem);
							},
						},
						{
							id: 'config_total_grand',
							hideItem: false,
							type: ItemType.Radio,
							caption: EstimateMainTotalTranslateEnum.Grand,
							iconClass: 'tlb-icons ico-total-grand',
							fn: () => {
								this.dataService.recalculateTotalValues(EstimateMainTotalKeyEnum.Grand);
							},
						},
						{
							id: 'config_total_line_item',
							hideItem: false,
							type: ItemType.Radio,
							caption: EstimateMainTotalTranslateEnum.LineItem,
							iconClass: 'tlb-icons ico-total-line-item',
							fn: () => {
								this.dataService.recalculateTotalValues(EstimateMainTotalKeyEnum.LineItem);
							},
						},
						{
							id: 'config_total_filter',
							hideItem: false,
							type: ItemType.Radio,
							caption: EstimateMainTotalTranslateEnum.Filter,
							iconClass: 'tlb-icons ico-total-filter',
							fn: () => {
								this.dataService.recalculateTotalValues(EstimateMainTotalKeyEnum.Filter);
							},
						},
					],
				},
			},
			{
				id: 'filterZeroValue',
				hideItem: false,
				type: ItemType.Check,
				caption: 'procurement.common.total.toolbarFilter',
				iconClass: 'tlb-icons ico-on-off-zero',
				fn: () => {
					void this.dataService.recalculateTotalValues(this.dataService.TotalKey);
				},
			},
		]);
	}
}
