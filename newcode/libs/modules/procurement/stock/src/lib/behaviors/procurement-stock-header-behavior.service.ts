/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Subscription } from 'rxjs';
import { IStockHeaderVEntity } from '../model';

@Injectable({
	providedIn: 'root',
})
export class ProcurementStockHeaderBehavior implements IEntityContainerBehavior<IGridContainerLink<IStockHeaderVEntity>, IStockHeaderVEntity> {
	private subscriptions: Subscription[] = [];

	public onCreate(containerLink: IGridContainerLink<IStockHeaderVEntity>): void {}

	public onDestroy(containerLink: IGridContainerLink<IStockHeaderVEntity>): void {
		this.subscriptions.forEach((sub) => {
			sub.unsubscribe();
		});
	}
}
