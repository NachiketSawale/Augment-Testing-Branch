/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ProjectMainBillToDataService } from '../services/project-main-bill-to-data.service';
import { ItemType } from '@libs/ui/common';
import { IProjectMainBillToEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProjectMainBillToBehavior implements IEntityContainerBehavior<IGridContainerLink<IProjectMainBillToEntity>, IProjectMainBillToEntity> {

	private dataService: ProjectMainBillToDataService;
	

	public constructor() {
		this.dataService = inject(ProjectMainBillToDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IProjectMainBillToEntity>): void {
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