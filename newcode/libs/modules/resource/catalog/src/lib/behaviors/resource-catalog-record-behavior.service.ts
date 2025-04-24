/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';
import { IResourceCatalogRecordEntity } from '@libs/resource/interfaces';
import { IIdentificationData } from '@libs/platform/common';
import { ResourceCatalogRecordDataService } from '../services/resource-catalog-record-data.service';

@Injectable({
	providedIn: 'root',
})
export class ResourceCatalogRecordBehavior implements IEntityContainerBehavior<IGridContainerLink<IResourceCatalogRecordEntity>, IResourceCatalogRecordEntity> {

	private readonly resourceCatalogRecordDataService = inject(ResourceCatalogRecordDataService);

	public onCreate(containerLink: IGridContainerLink<IResourceCatalogRecordEntity>): void {

		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<IResourceCatalogRecordEntity>) {
		// This button is for dummy grid container temporary for drag-drop service development.
		// It should be removed when PlatformSourceWindowDataServiceFactory.createDataService() is available
		containerLink.uiAddOns.toolbar.addItems([{
			caption: { key: 'load' },
			hideItem: false,
			iconClass: 'tlb-icons ico-refresh',
			id: 'load',
			fn: () => {
				this.resourceCatalogRecordDataService.load({id: 1, PKey1:1000226} as IIdentificationData);
			},
			sort: 10,
			type: ItemType.Item,
		}]);
	}

}