/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { isEmpty } from 'lodash';

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';

import { ProcurementStockItemInfoDataService } from '../services/procurement-stock-item-info-data.service';
import { IStockItemInfoViewOptions } from '../components/item-info/item-info.component';
import { IStockItemInfoVEntity } from '../model/entities/stock-item-info-ventity.interface';



/**
 * Procurement Stock Item Info Behavior Service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementStockItemInfoBehavior implements IEntityContainerBehavior<IGridContainerLink<IStockItemInfoVEntity>, IStockItemInfoVEntity> {
	/**
	 * To inject ProcurementStockItemInfoDataService
	 */
	private dataService = inject(ProcurementStockItemInfoDataService);

	/**
	 * The viewOptions holds the filter criteria used to manage data updates and retrieval in the data service.
	 */
	public viewOptions: IStockItemInfoViewOptions = {
		isOutStanding: true,
		isDelivered: true,
		startDate: undefined,
		endDate: undefined,
	};

	/**
	 * This method is invoked right when the container component is being created.
	 */
	public onCreate(containerLink: IGridContainerLink<IStockItemInfoVEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 'refresh',
				caption: { key: 'basics.common.button.refresh' },
				hideItem: false,
				iconClass: 'tlb-icons ico-refresh',
				type: ItemType.Item,
				sort: 1,
				fn: () => {
					this.dataService.initItemInfoFilter(this.viewOptions);
					this.dataService.load({ id: 0 });
				},
				disabled: () => {
					return isEmpty(this.dataService.getParentData());
				},
			},
			{
				id: 'dItemSub',
				type: ItemType.Divider,
			},
		]);
	}
}
