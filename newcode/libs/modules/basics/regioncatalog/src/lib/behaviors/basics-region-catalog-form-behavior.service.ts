/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IEntityContainerLink, IGridContainerLink } from '@libs/ui/business-base';

import { ItemType } from '@libs/ui/common';
import { BasicsRegionCatalogEntity } from "../model/basics-region-catalog-entity.class";
import { BasicsRegionCatalogDataService } from "../services/basics-region-catalog-data.service";


@Injectable({
	providedIn: 'root',
})
export class BasicsRegionCatalogFormBehavior implements IEntityContainerBehavior<IEntityContainerLink<BasicsRegionCatalogEntity>, BasicsRegionCatalogEntity> {
	private dataService: BasicsRegionCatalogDataService;
	
	public constructor() {
		this.dataService = inject(BasicsRegionCatalogDataService);
	}

	public onCreate(containerLink: IEntityContainerLink<BasicsRegionCatalogEntity>): void {
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
				caption: 'First',
				hideItem: false,
				iconClass: ' tlb-icons ico-rec-first',
				id: 'first',
				fn: () => {
					this.dataService.selectFirst().then();
				},
				sort: 101,
				type: ItemType.Item,
			},
			{
				caption: 'Previous',
				hideItem: false,
				iconClass: ' tlb-icons ico-rec-previous',
				id: 'previous',
				fn: () => {
					this.dataService.selectPrevious().then();
				},
				sort: 102,
				type: ItemType.Item,
			},
			{
				caption: 'Next',
				hideItem: false,
				iconClass: ' tlb-icons ico-rec-next',
				id: 'next',
				fn: () => {
					this.dataService.selectNext().then();
				},
				sort: 103,
				type: ItemType.Item,
			},
			{
				caption: 'Last',
				hideItem: false,
				iconClass: ' tlb-icons ico-rec-last',
				id: 'last',
				fn: () => {

					this.dataService.selectLast().then();
				},
				sort: 104,
				type: ItemType.Item,
			}
		]);
		containerLink.uiAddOns.toolbar.deleteItems("grouping");

	}

}
