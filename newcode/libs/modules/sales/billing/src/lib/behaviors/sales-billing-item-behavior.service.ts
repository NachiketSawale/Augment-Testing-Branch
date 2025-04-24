/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IItemEntity} from '@libs/sales/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class SalesBillingItemBehavior implements IEntityContainerBehavior<IGridContainerLink<IItemEntity>, IItemEntity> {
		/**
		 * Add custom toolbar items for respective container.
		 * @param containerLink {IGridContainerLink}
		 */
	public onCreate(containerLink: IGridContainerLink<IItemEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.bulkEditor.title' },
				hideItem: false,
				iconClass: 'type-icons ico-construction51',
				id: 'bulkEditor',
				fn: () => {
					//TODO: Implement this method
				},
				sort: 130,
				type: ItemType.Item,
			},
			{
				caption: { key: 'sales.billing.itemNoConfigDlgTitle' },
				iconClass: 'tlb-icons ico-settings-doc',
				id: 'Item Numbering Configuration',
				fn: () => {
					//TODO: Implement this method
				},
				disabled: false,
				sort: 250,
				type: ItemType.Item,
			}
		]);
	}
}