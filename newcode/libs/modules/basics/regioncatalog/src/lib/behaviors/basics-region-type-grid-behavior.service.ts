/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { BasicsRegionCatalogDataService } from "../services/basics-region-catalog-data.service";
import { BasicsRegionTypeEntity } from "../model/basics-region-type-entity.class";


@Injectable({
	providedIn: 'root',
})
export class BasicsRegionTypeGridBehavior implements IEntityContainerBehavior<IGridContainerLink<BasicsRegionTypeEntity>, BasicsRegionTypeEntity> {
	private dataService: BasicsRegionCatalogDataService;
	
	public constructor() {
		this.dataService = inject(BasicsRegionCatalogDataService);
	}

	public onCreate(containerLink: IGridContainerLink<BasicsRegionTypeEntity>): void {

		containerLink.uiAddOns.toolbar.deleteItems(["create", "delete"]);

	}

}
