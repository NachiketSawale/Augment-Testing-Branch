/*
 * Copyright(c) RIB Software GmbH
 */


import { Injectable, inject } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { InsertPosition, ISimpleMenuItem, ItemType } from '@libs/ui/common';

import { IEngProdComponentEntity } from '../model/models';
import { PpsProductComponentDataService } from '../services/pps-product-component-data.service';

@Injectable({
	providedIn: 'root'
})
export class PpsProductComponentBehavior implements IEntityContainerBehavior<IGridContainerLink<IEngProdComponentEntity>, IEngProdComponentEntity> {

	private dataService: PpsProductComponentDataService;
	

	private mappingBtn: ISimpleMenuItem<void> = {
		id: 'copy',
		sort: 2,
		caption: 'productionplanning.product.engProdComponent.engPropCompMapDialogTitle',
		type: ItemType.Item,
		iconClass: 'control-icons ico-criterion-lookup',
		fn: function () {
			throw new Error('todo');
		},
		disabled: () => {
			return !this.dataService.hasSelection();
		}
	};

	public constructor() {
		this.dataService = inject(PpsProductComponentDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IEngProdComponentEntity>): void {
		containerLink.uiAddOns.toolbar.addItemsAtId([this.mappingBtn], EntityContainerCommand.CreateRecord, InsertPosition.Before);
	}
}