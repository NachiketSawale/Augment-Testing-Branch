/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { IProjectEntity } from '@libs/project/interfaces';
import { ItemType } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class ProjectMainBehavior implements IEntityContainerBehavior<IGridContainerLink<IProjectEntity>, IProjectEntity> {
	

	public onCreate(containerLink: IGridContainerLink<IProjectEntity>): void {

		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<IProjectEntity>) {
		containerLink.uiAddOns.toolbar.addItems([{
			caption: { key: 'project.main.costGroupConfiguration' },
			hideItem: false,
			iconClass: 'tlb-icons ico-settings-doc',
			id: 'modalConfig',
			fn: () => {
				throw new Error('This method is not implemented');
			},
			sort: 300,
			type: ItemType.Item,
		}]);
	}

}