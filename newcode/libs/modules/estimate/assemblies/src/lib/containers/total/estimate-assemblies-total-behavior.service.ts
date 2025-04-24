/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { IEstCostTotalEntity } from '@libs/estimate/interfaces';
import { EstimateAssembliesTotalDataService } from './estimate-assemblies-total-data.service';

/**
 * Service to handle behaviors related to estimate assemblies total
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateAssembliesTotalBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstCostTotalEntity>, IEstCostTotalEntity> {
	/**
	 * EstimateAssembliesTotalBehavior constructor
	 */
	public constructor(private dataService: EstimateAssembliesTotalDataService) {}

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
								this.dataService.recalculateTotalValues();
							},
						},
					],
				},
			},
		]);
	}
}
