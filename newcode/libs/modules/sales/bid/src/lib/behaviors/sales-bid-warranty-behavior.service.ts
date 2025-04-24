/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IBidWarrantyEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root',
})
/**
 * The behavior for the sales bid warranty container.
 */
export class SalesBidWarrantyBehavior implements IEntityContainerBehavior<IGridContainerLink<IBidWarrantyEntity>, IBidWarrantyEntity> {
	/**
	 * It will update toolbar when container initialize.
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IBidWarrantyEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.bulkEditor.title' },
				hideItem: false,
				iconClass: 'type-icons ico-construction51',
				id: 'bulkEditor',
				fn: () => {
					//ToDo:This method is not implemented yet.
				},
				sort: 130,
				type: ItemType.Item,
			},
		]);
	}
}
