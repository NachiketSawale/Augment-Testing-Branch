/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ItemType } from '@libs/ui/common';
import { ITenderResultEntity } from '@libs/project/interfaces';


@Injectable({
	providedIn: 'root',
})
export class ProjectMainTenderResultGridBehavior implements IEntityContainerBehavior<IGridContainerLink<ITenderResultEntity>, ITenderResultEntity> {
	

	public onCreate(containerLink: IGridContainerLink<ITenderResultEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'project.main.entityRankings' },
				hideItem: false,
				iconClass: 'tlb-icons ico-demote',
				id: 'updateRankings',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 300,
				type: ItemType.Item,
			},
		]);

	}

}
