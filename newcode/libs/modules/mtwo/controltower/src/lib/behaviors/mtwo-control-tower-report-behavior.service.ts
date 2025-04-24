/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';
import { IMtwoPowerbiItemEntity } from '@libs/mtwo/interfaces';

/**
 * Mtwo Control Tower Report Behavior Service.
 */
@Injectable({
	providedIn: 'root',
})
export class MtwoControlTowerReportBehavior implements IEntityContainerBehavior<IGridContainerLink<IMtwoPowerbiItemEntity>, IMtwoPowerbiItemEntity> {
	/**
	 * It will update toolbar when container initialize.
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IMtwoPowerbiItemEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.bulkEditor.title' },
				iconClass: 'type-icons ico-construction51',
				id: 't14',
				//Todo: bulkEditor method is not implemented
				// fn: () => {	},
				sort: 220,
				type: ItemType.Item,
				disabled:true,
			},
		]);
	}
}
