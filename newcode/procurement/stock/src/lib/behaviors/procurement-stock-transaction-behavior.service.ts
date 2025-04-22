/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Subscription } from 'rxjs';
import { IStockTransactionEntity } from '../model/entities/stock-transaction-entity.interface';
import { ConcreteMenuItem, ItemType } from '@libs/ui/common';
import { ProcurementStockTransactionDataService } from '../services/procurement-stock-transaction-data.service';
import { ProcurementStockTotalDataService } from '../services/procurement-stock-total-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementStockTransactionBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IStockTransactionEntity>, IStockTransactionEntity> {
	private subscriptions: Subscription[] = [];
	private readonly dataService = inject(ProcurementStockTransactionDataService);
	private readonly stockTotalService = inject(ProcurementStockTotalDataService);

	public onCreate(containerLink: IGridContainerLink<IStockTransactionEntity>): void {
		const customToolbarItems: ConcreteMenuItem[] = [
			{
				id: 't1000',
				caption: { key: 'procurement.common.total.dirtyRecalculate' },
				iconClass: 'control-icons ico-recalculate',
				type: ItemType.Item,
				disabled: () => {
					return !this.dataService.canRecalculate();
				},
				fn: () => {
					const stockTotalEntity = this.stockTotalService.getSelectedEntity();
					if (stockTotalEntity) {
						this.stockTotalService.update(stockTotalEntity);
					}
				},
				sort: 1000,
			},
		];
		containerLink.uiAddOns.toolbar.addItems(customToolbarItems);
	}

	public onDestroy(containerLink: IGridContainerLink<IStockTransactionEntity>): void {
		this.subscriptions.forEach((sub) => {
			sub.unsubscribe();
		});
	}
}
