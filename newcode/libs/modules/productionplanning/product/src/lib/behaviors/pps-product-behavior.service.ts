/*
 * Copyright(c) RIB Software GmbH
 */


import { Injectable, inject } from '@angular/core';
import {
	EntityContainerCommand,
	IEntityContainerBehavior,
	IEntityContainerLink,
	IGridContainerLink
} from '@libs/ui/business-base';

import { PpsProductDataService } from '../services/pps-product-data.service';
import { IPpsProductEntity } from '../model/entities/product-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsProductGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsProductEntity>, IPpsProductEntity> {

	private dataService: PpsProductDataService;
	
	public constructor() {
		this.dataService = inject(PpsProductDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPpsProductEntity>): void {
		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<IPpsProductEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}

}


@Injectable({
	providedIn: 'root'
})
export class PpsProductFormBehavior implements IEntityContainerBehavior<IEntityContainerLink<IPpsProductEntity>, IPpsProductEntity> {

	private dataService: PpsProductDataService;
	public constructor() {
		this.dataService = inject(PpsProductDataService);
	}

	public onCreate(containerLink: IEntityContainerLink<IPpsProductEntity>): void {
		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IEntityContainerLink<IPpsProductEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}
}