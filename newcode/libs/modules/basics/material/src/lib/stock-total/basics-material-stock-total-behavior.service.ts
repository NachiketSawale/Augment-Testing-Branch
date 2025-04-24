/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { IBasicsStockTotalEntity } from '@libs/basics/shared';
import { BasicsMaterialStockTotalDataService } from './basics-material-stock-total-data.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialStockTotalBehavior implements IEntityContainerBehavior<IGridContainerLink<IBasicsStockTotalEntity>, IBasicsStockTotalEntity> {
	private dataService: BasicsMaterialStockTotalDataService;

	public constructor() {
		this.dataService = inject(BasicsMaterialStockTotalDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IBasicsStockTotalEntity>): void {

		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<IBasicsStockTotalEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'createChild']);
	}

}
