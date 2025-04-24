/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ConcreteMenuItem, ItemType } from '@libs/ui/common';
import { IBasicsEfbsheetsEntity } from '@libs/basics/interfaces';
import { ProjectEfbsheetsDataService } from '../services/project-efbsheets-data.service';

@Injectable({
	providedIn: 'root'
})
export class ProjectEfbSheetsBehavior implements IEntityContainerBehavior<IGridContainerLink<IBasicsEfbsheetsEntity>, IBasicsEfbsheetsEntity> {
	private dataService = inject(ProjectEfbsheetsDataService);
	public onCreate(containerLink: IGridContainerLink<IBasicsEfbsheetsEntity>): void {
		this.addItemsToToolbar(containerLink);
	}

	private addItemsToToolbar(containerLink: IGridContainerLink<IBasicsEfbsheetsEntity>) {
		const customToolbarItems: ConcreteMenuItem[] = [
			{
				caption: { key: 'basics.efbsheets.copyMasterCrewMix' },
				iconClass: ' tlb-icons ico-copy-line-item',
				type: ItemType.Item,
				sort: 1,
				fn: () => {
					//this.dataService;      // TODO: Implement copyMasterCrewMix
				}
			}
		];

		containerLink.uiAddOns.toolbar.addItems(customToolbarItems);
	}
}
