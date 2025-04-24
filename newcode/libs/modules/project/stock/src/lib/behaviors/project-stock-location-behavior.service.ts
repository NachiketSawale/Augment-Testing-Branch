/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ItemType } from '@libs/ui/common';
import { IProjectStockLocationEntity } from '@libs/project/interfaces';
import { ProjectStockLocationDataService } from '../services/project-stock-location-data.service';


@Injectable({
	providedIn: 'root',
})
export class ProjectStockLocationBehavior implements IEntityContainerBehavior<IGridContainerLink<IProjectStockLocationEntity>, IProjectStockLocationEntity> {
	private dataService: ProjectStockLocationDataService;
	

	public constructor() {
		this.dataService = inject(ProjectStockLocationDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IProjectStockLocationEntity>): void {

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
		]);
		containerLink.uiAddOns.toolbar.deleteItems('grouping');
	}

	
}
