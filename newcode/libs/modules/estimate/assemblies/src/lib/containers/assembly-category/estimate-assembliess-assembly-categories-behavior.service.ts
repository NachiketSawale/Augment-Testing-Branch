/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ItemType } from '@libs/ui/common';
import { EstimateAssembliesAssemblyCategoriesDataService } from './estimate-assemblies-assembly-categories-data.service';
import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';

/*
 * Define an InjectionToken for the behavior
 */
export const ESTIMATE_ASSEMBLY_ASSEMBLIES_CATEGORY_BEHAVIOR_TOKEN = new InjectionToken<EstimateAssemblyAssembliesCategoryBehavior>('estimateProjectBehavior');

@Injectable({
	providedIn: 'root',
})

/*
 * Service to handle behaviors related to estimate assemblies
 */

// todo Not fully implemented ( methods implementation is remaining)
export class EstimateAssemblyAssembliesCategoryBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstAssemblyCatEntity>, IEstAssemblyCatEntity> {
	private dataService: EstimateAssembliesAssemblyCategoriesDataService;

	/*
	 * Constructor to inject DataService
	 */

	public constructor() {
		this.dataService = inject(EstimateAssembliesAssemblyCategoriesDataService);
	}

	/*
	 * Method called when a container is created
	 */

	public onCreate(containerLink: IGridContainerLink<IEstAssemblyCatEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe((data) => {
			containerLink.gridData = data;
		});

		this.customizeToolbar(containerLink);
		containerLink.registerSubscription(dataSub);
	}

	/*
	 * Method to customize toolbar items
	 */

	private customizeToolbar(containerLink: IGridContainerLink<IEstAssemblyCatEntity>) {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.toolbarInsertSub' },
				hideItem: false,
				iconClass: 'tlb-icons ico-sub-fld-new',
				id: 'createChild',
				sort: 40,
				disabled: () => {
					return !this.dataService.canCreateChild();
				},
				fn: () => {
					this.dataService.createChild();
				},
				type: ItemType.Item,
			},

			{
				//createChild
				caption: { key: 'cloud.common.toolbarCollapse' },
				hideItem: false,
				iconClass: 'tlb-icons ico-tree-collapse',
				id: 'collapse',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 60,
				type: ItemType.Item,
			},
			{
				caption: { key: 'cloud.common.toolbarExpand' },
				hideItem: false,
				iconClass: 'tlb-icons ico-tree-expand',
				id: 'expand',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 70,
				type: ItemType.Item,
			},

			{
				caption: { key: 'cloud.common.toolbarCollapseAll' },
				hideItem: false,
				iconClass: ' tlb-icons ico-tree-collapse-all',
				id: EntityContainerCommand.CollapseAll,
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 80,
				type: ItemType.Item,
			},
			{
				caption: { key: 'cloud.common.toolbarExpandAll' },
				hideItem: false,
				iconClass: 'tlb-icons ico-tree-expand-all',
				id: EntityContainerCommand.ExpandAll,
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 90,
				type: ItemType.Item,
			},
			{
				caption: { key: 'cloud.common.toolbarSelectionMode' },
				hideItem: false,
				iconClass: 'tlb-icons ico-selection-multi',
				id: '120',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 90,
				type: ItemType.Check,
			},
		]);
	}

}
