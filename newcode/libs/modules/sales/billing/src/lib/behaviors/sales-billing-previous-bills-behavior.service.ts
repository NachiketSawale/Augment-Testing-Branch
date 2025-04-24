/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IBilHeaderEntity } from '@libs/sales/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';


@Injectable({
	providedIn: 'root'
})

/**
 * Sales Billing Chained Invoices (Previous Bills) Behaviour Service.
 */
export class SalesBillingPreviousBillsBehavior implements IEntityContainerBehavior<IGridContainerLink<IBilHeaderEntity>, IBilHeaderEntity> {
	/**
		 * Add custom toolbar items for respective container.
		 * @param containerLink {IGridContainerLink}
		 */
	public onCreate(containerLink: IGridContainerLink<IBilHeaderEntity>): void {
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
			}
		]);
	}
}