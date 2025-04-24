/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import { ISalesLineItemQuantityEntity } from '../model/entities/sales-line-item-quantity-entity.interface';
import {InsertPosition, ItemType} from '@libs/ui/common';
import {SalesWipLineItemDataService} from '../services/sales-wip-line-item-data.service';

@Injectable({
	providedIn: 'root'
})

export class SalesWipLineItemBehaviourService implements IEntityContainerBehavior<IGridContainerLink<ISalesLineItemQuantityEntity>, ISalesLineItemQuantityEntity> {
	public dataService = inject(SalesWipLineItemDataService);

	public onCreate(containerLink: IGridContainerLink<ISalesLineItemQuantityEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			{
				id: 'toggleLineItems',
				caption: { text: 'switchLineItems', key: 'switchLineItems' },
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-indirect-costs',
			},
			EntityContainerCommand.CreateRecord,
			InsertPosition.Instead,
		);
	}
}