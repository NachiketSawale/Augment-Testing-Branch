/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { IBoqWic2assemblyEntity } from '@libs/boq/interfaces';
import { EstimateMainAssemblyRelateDataService } from './estimate-main-assembly-relate-data.service';
import { EstRelateAssemblyFilter } from './enums/estimate-main-assembly-relate-filter-key.enum';

/**
 * Service to handle behaviors related to estimate relate assembly
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateMainAssemblyRelateBehavior implements IEntityContainerBehavior<IGridContainerLink<IBoqWic2assemblyEntity>, IBoqWic2assemblyEntity> {
	/**
	 * EstimateMainAssemblyRelateBehavior constructor
	 */
	public constructor(private dataService: EstimateMainAssemblyRelateDataService) {}

	/**
	 * Method to call when a container is created
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IBoqWic2assemblyEntity>): void {
		this.customizeToolbar(containerLink);
	}

	/**
	 * Private method to customize the toolbar with additional items
	 * @param containerLink
	 * @private
	 */
	private customizeToolbar(containerLink: IGridContainerLink<IBoqWic2assemblyEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 'assemblyFilterTypes',
				hideItem: false,
				type: ItemType.Sublist,
				list: {
					activeValue: this.dataService.FilterKey,
					cssClass: 'radio-group',
					showTitles: true,
					items: [
						{
							id: 'with_boq',
							hideItem: false,
							type: ItemType.Radio,
							caption: 'estimate.main.filterBoq',
							iconClass: 'tlb-icons ico-filter-boq',
							value: EstRelateAssemblyFilter.ByBoq,
							fn: () => {
								this.dataService.reLoadGrid(EstRelateAssemblyFilter.ByBoq);
							},
						},
						{
							id: 'with_wicboq',
							hideItem: false,
							type: ItemType.Radio,
							value: EstRelateAssemblyFilter.ByWicBoq,
							caption: 'estimate.main.filterBoqWic',
							iconClass: 'tlb-icons ico-filter-wic-boq',
							fn: () => {
								this.dataService.reLoadGrid(EstRelateAssemblyFilter.ByWicBoq);
							},
						},
						{
							id: 'with_assemblyStructure',
							hideItem: false,
							type: ItemType.Radio,
							value: EstRelateAssemblyFilter.ByAssemblyCat,
							iconClass: 'tlb-icons ico-filter-assembly-cat',
							caption: 'estimate.main.filterAssemblyStructure',
							fn: () => {
								this.dataService.reLoadGrid(EstRelateAssemblyFilter.ByAssemblyCat);
							},
						},
					],
				},
			},
		]);
	}
}
