/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Subscription } from 'rxjs';
import { IStockTotalVEntity } from '../model';

@Injectable({
	providedIn: 'root',
})
export class ProcurementStockTotalBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IStockTotalVEntity>, IStockTotalVEntity> {
	private subscriptions: Subscription[] = [];

	public onCreate(containerLink: IGridContainerLink<IStockTotalVEntity>): void {}

	public onDestroy(containerLink: IGridContainerLink<IStockTotalVEntity>): void {
		this.subscriptions.forEach((sub) => {
			sub.unsubscribe();
		});
	}
}
