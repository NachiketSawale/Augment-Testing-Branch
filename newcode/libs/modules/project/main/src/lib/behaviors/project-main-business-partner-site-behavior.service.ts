/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ProjectMainBusinessPartnerSiteDataService } from '../services/project-main-business-partner-site-data.service';
import { ItemType } from '@libs/ui/common';
import { IProjectMainBusinessPartnerSiteEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProjectMainBusinessPartnerSiteBehavior implements IEntityContainerBehavior<IGridContainerLink<IProjectMainBusinessPartnerSiteEntity>, IProjectMainBusinessPartnerSiteEntity> {

	private dataService: ProjectMainBusinessPartnerSiteDataService;
	

	public constructor() {
		this.dataService = inject(ProjectMainBusinessPartnerSiteDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IProjectMainBusinessPartnerSiteEntity>): void {
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