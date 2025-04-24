/*
 * Copyright(c) RIB Software GmbH
 */


import { Injectable, inject } from '@angular/core';
import {
	EntityContainerCommand,
	IEntityContainerBehavior,
	IGridContainerLink
} from '@libs/ui/business-base';

import {IPpsCuttingProductVEntity} from '../model/entities/pps-cutting-product-v-entity.interface';
import {PpsCuttingProductDataService} from '../services/pps-product-cutting-data.service';

@Injectable({
	providedIn: 'root'
})
export class PpsProductCuttingGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsCuttingProductVEntity>, IPpsCuttingProductVEntity> {

	private dataService: PpsCuttingProductDataService;
	
	public constructor() {
		this.dataService = inject(PpsCuttingProductDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPpsCuttingProductVEntity>): void {
		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<IPpsCuttingProductVEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}
}