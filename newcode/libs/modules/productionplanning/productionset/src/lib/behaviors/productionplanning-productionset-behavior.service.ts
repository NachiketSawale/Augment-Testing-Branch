/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IProductionsetEntity } from '../model/models';
import { ProductionplanningProductionsetDataService } from '../services/productionplanning-productionset-data.service';

import { ItemType } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class ProductionplanningProductionsetBehavior implements IEntityContainerBehavior<IGridContainerLink<IProductionsetEntity>, IProductionsetEntity> {
	private dataService: ProductionplanningProductionsetDataService;

	public constructor() {
		this.dataService = inject(ProductionplanningProductionsetDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IProductionsetEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { text: 'Pin Selected Item' },
				hideItem: false,
				iconClass: 'tlb-icons ico-set-prj-context',
				id: 't-pinningctx',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 20,
				type: ItemType.Item,
			},
			{
				caption: { key: 'productionplanning.common.manualLog.addLog', text: 'New Log' },
				hideItem: false,
				iconClass: 'tlb-icons ico-toggle-comment',
				id: 'd0',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: -2,
				type: ItemType.Item,

			},

			{
				caption: { key: 'cloud.common.Navigator.goBackTo', text: 'Go back to' },
				hideItem: false,
				iconClass: 'tlb-icons ico-goto-back',
				id: 't14',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: -1,
				type: ItemType.Item,
			},
		]);
	}

}
