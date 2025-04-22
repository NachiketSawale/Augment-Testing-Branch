/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IPackageEstimateLineItemEntity} from '../model/entities/package-estimate-line-item-entity.interface';
import {ProcurementPackageEstimateLineItemDataService} from '../services/package-estimate-line-item-data.service';
import {ConcreteMenuItem, InsertPosition, ItemType} from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageEstimateLineItemBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IPackageEstimateLineItemEntity>, IPackageEstimateLineItemEntity> {
	private readonly dataService = inject(ProcurementPackageEstimateLineItemDataService);

	public onCreate(containerLink: IGridContainerLink<IPackageEstimateLineItemEntity>) {
		const customToolItems: ConcreteMenuItem<void>[] = [
			{
				id: 'jobFilter',
				caption: 'cloud.common.jobFilter',
				type: ItemType.DropdownBtn,
				iconClass: 'tlb-icons ico-filter-based-job',
				list: {
					showImages: false,
					cssClass: 'dropdown-menu-right',
					items: [
						// todo chi: dynamic items
					]
				}
			},
			{
				id: 'versionFilter',
				caption: 'cloud.common.versionFilter',
				type: ItemType.DropdownBtn,
				iconClass: 'tlb-icons ico-filter-based-estimate',
				list: {
					showImages: false,
					cssClass: 'dropdown-menu-right',
					items: [
						{
							id: 'activeEstHeaderMenu',
							type: ItemType.Check,
							value: false,
							caption: 'cloud.common.currentEstimates',
							fn: async () => {
								const selected = this.dataService.getSelectedEntity();
								if (!selected) {
									return;
								}

								// todo chi: do it later
								// await this.dataService.getJobIdsByEstHeader(customToolItems, /* args */[], 'activeEstHeaderMenu');
								// .then(function (data) {
								// let jobs = service.hightLightNGetJob($scope, data.highlightJobIds, data.cancelJobFkIds);
								// dataService.setSelectedJobsIds(jobs);
								// dataService.setInitFilterMenuFlag(false);
								// dataService.setIsManuallyFilter(true);
								// dataService.load();
								// mainViewService.customData($scope.gridId, 'GroupConfigID', item);
								// });
							}
						}
					]
				}
			}
		];
		containerLink.uiAddOns.toolbar.addItemsAtId(
			customToolItems,
			EntityContainerCommand.Settings,
			InsertPosition.Before,
		);
	}
}