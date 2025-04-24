/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ProjectMainCertificateDataService } from '../services/project-main-certificate-data.service';
import { ItemType } from '@libs/ui/common';
import { IProjectMainCertificateEntity } from '@libs/project/interfaces';
@Injectable({
	providedIn: 'root'
})
export class ProjectMainCertificateBehavior implements IEntityContainerBehavior<IGridContainerLink<IProjectMainCertificateEntity>, IProjectMainCertificateEntity> {

	private dataService: ProjectMainCertificateDataService;
	

	public constructor() {
		this.dataService = inject(ProjectMainCertificateDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IProjectMainCertificateEntity>): void {
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