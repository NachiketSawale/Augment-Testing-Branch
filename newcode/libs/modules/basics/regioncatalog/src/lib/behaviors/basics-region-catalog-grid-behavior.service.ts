/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ItemType } from '@libs/ui/common';
import { BasicsRegionCatalogEntity } from "../model/basics-region-catalog-entity.class";
import { BasicsRegionCatalogDataService } from "../services/basics-region-catalog-data.service";


@Injectable({
	providedIn: 'root',
})
export class BasicsRegionCatalogGridBehavior implements IEntityContainerBehavior<IGridContainerLink<BasicsRegionCatalogEntity>, BasicsRegionCatalogEntity> {
	private dataService: BasicsRegionCatalogDataService;
	
	public constructor() {
		this.dataService = inject(BasicsRegionCatalogDataService);
	}

	public onCreate(containerLink: IGridContainerLink<BasicsRegionCatalogEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.toolbarInsertSub' },
				hideItem: false,
				iconClass: ' tlb-icons ico-sub-fld-new',
				id: 'createChild',
				disabled: () => {
					return !this.dataService.canCreateChild();
				},
				fn: () => {
					this.dataService.createChild().then();
				},
				sort: 5,
				type: ItemType.Item,
			},
			{
			caption: { key: 'cloud.common.bulkEditor.title' },
			hideItem: false,
			iconClass: 'type-icons ico-construction51',
			id: 'bulkEditor',
			fn: () => {
				throw new Error('This method is not implemented');
			},
			sort: 130,
			type: ItemType.Item,
			},
			{
				caption: { key: 'cloud.common.toolbarCollapse'},
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
				caption: { key: 'cloud.common.toolbarExpand'},
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
				caption: { key: 'cloud.common.toolbarCollapseAll'},
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
				caption: { key: 'cloud.common.toolbarExpandAll'},
				hideItem: false,
				iconClass: 'tlb-icons ico-tree-expand-all',
				id: EntityContainerCommand.ExpandAll,
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 90,
				type: ItemType.Item,
			},
		]);
		containerLink.uiAddOns.toolbar.deleteItems("grouping");

	}

}
