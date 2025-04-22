/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { ICertificateEntity } from '@libs/businesspartner/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})

/**
 * Sales Bid Actual Certificate Behavior service
 */
export class SalesBidActualCertificateBehavior implements IEntityContainerBehavior<IGridContainerLink<ICertificateEntity>, ICertificateEntity> {
	/**
	 * Add custom toolbar items for respective container.
	 * @param containerLink {IGridContainerLink}
	 */
	public onCreate(containerLink: IGridContainerLink<ICertificateEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.bulkEditor.title' },
				hideItem: false,
				iconClass: 'type-icons ico-construction51',
				id: 'bulkEditor',
				fn: () => {
					//Todo:method implementation
				},
				sort: 130,
				type: ItemType.Item,
			},
		]);
	}
}