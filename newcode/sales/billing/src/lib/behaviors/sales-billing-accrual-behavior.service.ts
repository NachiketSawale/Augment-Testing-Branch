/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IAccrualEntity } from '@libs/sales/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';
/**
 * Sales Billing Accrual Behavior service
 */
@Injectable({
	providedIn: 'root'
})
export class SalesBillingAccrualBehavior implements IEntityContainerBehavior<IGridContainerLink<IAccrualEntity>, IAccrualEntity> {
/**
	 * Add custom toolbar items for respective container.
	 * @param containerLink {IGridContainerLink}
	 */
	public onCreate(containerLink: IGridContainerLink<IAccrualEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.bulkEditor.title' },
				hideItem: false,
				iconClass: 'type-icons ico-construction51',
				id: 'bulkEditor',
				//Todo: bulkEditor method is not implemented
				// fn: () => {	},
				sort: 130,
				type: ItemType.Item,
			}
		]);
	}
}