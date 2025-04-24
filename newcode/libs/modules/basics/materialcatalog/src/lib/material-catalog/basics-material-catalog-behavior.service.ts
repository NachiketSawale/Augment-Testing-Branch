/*
 * Copyright(c) RIB Software GmbH
 */

import { isEmpty } from 'lodash';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { BasicsMaterialCatalogDataService } from './basics-material-catalog-data.service';
import { ItemType } from '@libs/ui/common';
import { IMaterialCatalogEntity } from '@libs/basics/shared';
export const BASICS_MATERIAL_CATALOG_BEHAVIOR_TOKEN = new InjectionToken<BasicsMaterialCatalogBehavior>('basicsMaterialCatalogBehavior');

@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialCatalogBehavior implements IEntityContainerBehavior<IGridContainerLink<IMaterialCatalogEntity>, IMaterialCatalogEntity> {
	private dataService: BasicsMaterialCatalogDataService;
	
	public constructor() {
		this.dataService = inject(BasicsMaterialCatalogDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IMaterialCatalogEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				//TODO: framework should provide the default button.
				caption: { key: 'cloud.common.deepCopy' },
				hideItem: false,
				iconClass: 'tlb-icons ico-copy-paste-deep',
				id: 't12',
				sort: 1001,
				disabled: () => {
					return isEmpty(this.dataService.getSelection());
				},
				fn: () => {
					this.dataService.deepCopy();
				},
				type: ItemType.Item,
			},
		]);
	}

}
