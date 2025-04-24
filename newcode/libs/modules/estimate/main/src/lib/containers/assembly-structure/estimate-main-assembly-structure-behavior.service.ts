/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ISearchPayload } from '@libs/platform/common';
import { ItemType } from '@libs/ui/common';
import { EstimateMainAssemblyStructureDataService } from './estimate-main-assembly-structure-data.service';
import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';

/*
 * Define an InjectionToken for the behavior
 */
export const ESTIMATE_MAIN_ASSEMBLY_STRUCTURE_BEHAVIOR_TOKEN = new InjectionToken<EstimateMainAssemblyStructureBehavior>('estimateProjectBehavior');

@Injectable({
	providedIn: 'root',
})

/*
 * Service to handle behaviors related to estimate assemblies
 */

// todo Not fully implemented ( methods implementation is remaining)
export class EstimateMainAssemblyStructureBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstAssemblyCatEntity>, IEstAssemblyCatEntity> {

	private dataService: EstimateMainAssemblyStructureDataService;

	private searchPayload: ISearchPayload = {
		executionHints: false,
		filter: '',
		includeNonActiveItems: false,

		isReadingDueToRefresh: false,
		pageNumber: 0,
		pageSize: 100,
		pattern: '',
		pinningContext: [],
		projectContextId: null,
		useCurrentClient: true,
	};

	/*
	 * Constructor to inject DataService
	 */

	public constructor() {
		this.dataService = inject(EstimateMainAssemblyStructureDataService);
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
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'createChild']);
		containerLink.uiAddOns.toolbar.addItems([
			{
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
