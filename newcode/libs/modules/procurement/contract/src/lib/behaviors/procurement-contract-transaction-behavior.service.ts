/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IConTransactionEntity } from '../model/entities/con-transaction-entity.interface';

export const PROCUREMENT_CONTRACT_TRANSACTION_BEHAVIOR_TOKEN = new InjectionToken<ProcurementContractTransactionBehavior>('procurementContractTransactionBehavior');

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractTransactionBehavior implements IEntityContainerBehavior<IGridContainerLink<IConTransactionEntity>, IConTransactionEntity> {
	
	public onCreate(containerLink: IGridContainerLink<IConTransactionEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems(['create','delete']);
	}

}
