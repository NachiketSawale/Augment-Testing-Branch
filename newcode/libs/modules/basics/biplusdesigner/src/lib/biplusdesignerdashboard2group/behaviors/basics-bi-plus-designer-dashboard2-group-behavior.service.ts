/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IDashboard2GroupEntity } from '../model/entities/dashboard-2group-entity.interface';

/**
 * Basicsbiplusdesigner Dashboard to Group Grid Behavior Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsBiPlusDesignerDashboard2GroupBehavior implements IEntityContainerBehavior<IGridContainerLink<IDashboard2GroupEntity>, IDashboard2GroupEntity> {
	/**
	 * Add custom toolbar items for respective container.
	 * @param containerLink {IGridContainerLink}
	 */
	public onCreate(containerLink: IGridContainerLink<IDashboard2GroupEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
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
			}
		]);
	}
}