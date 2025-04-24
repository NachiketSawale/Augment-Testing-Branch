/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ItemType } from '@libs/ui/common';
import { BasicsMaterialCatalogDiscountGroupDataService } from './basics-material-catalog-discount-group-data.service';
import { IMaterialDiscountGroupEntity } from '../model/entities/material-discount-group-entity.interface';

export const BASICS_MATERIAL_CATALOG_DISCOUNT_GROUP_BEHAVIOR_TOKEN = new InjectionToken<BasicsMaterialCatalogDiscountGroupBehavior>('basicsMaterialCatalogDiscountGroupBehavior');

@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialCatalogDiscountGroupBehavior implements IEntityContainerBehavior<IGridContainerLink<IMaterialDiscountGroupEntity>, IMaterialDiscountGroupEntity> {
	private dataService: BasicsMaterialCatalogDiscountGroupDataService;
	
	public constructor() {
		this.dataService = inject(BasicsMaterialCatalogDiscountGroupDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IMaterialDiscountGroupEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.toolbarInsertSub' },
				hideItem: false,
				iconClass: 'tlb-icons ico-sub-fld-new',
				id: 'createChild',
				sort: 40,
				disabled: () => {
					return !this.dataService.canCreateChild();
				},
				fn: () => {
					this.dataService.createChild();
				},
				type: ItemType.Item,
			},
		]);
	}

}
