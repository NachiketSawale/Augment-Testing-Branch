/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ItemType } from '@libs/ui/common';
import { ILogisticSundryServicePriceListEntity } from '@libs/logistic/interfaces';
import { LogisticSundryServicePriceListDataService } from '../services/logistic-sundry-service-price-list-data.service';


@Injectable({
	providedIn: 'root',
})
export class LogisticSundryServicePriceListGridBehavior implements IEntityContainerBehavior<IGridContainerLink<ILogisticSundryServicePriceListEntity>, ILogisticSundryServicePriceListEntity> {
	private dataService: LogisticSundryServicePriceListDataService;
	
	public constructor() {
		this.dataService = inject(LogisticSundryServicePriceListDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ILogisticSundryServicePriceListEntity>): void {
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
			},
		]);
	}

}
