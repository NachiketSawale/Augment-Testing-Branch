/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Subscription } from 'rxjs';
import { IPesTransactionEntity } from '../model/entities';


export const PROCUREMENT_PES_TRANSACTION_BEHAVIOR_TOKEN = new InjectionToken<ProcurementPesTransactionBehavior>('procurementPesTransactionBehavior');

@Injectable({
	providedIn: 'root',
})
export class ProcurementPesTransactionBehavior implements IEntityContainerBehavior<IGridContainerLink<IPesTransactionEntity>, IPesTransactionEntity> {
	private subscriptions: Subscription[] = [];

	public onCreate(containerLink: IGridContainerLink<IPesTransactionEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}

	public onDestroy(containerLink: IGridContainerLink<IPesTransactionEntity>): void {
		this.subscriptions.forEach((sub) => {
			sub.unsubscribe();
		});
	}
}
