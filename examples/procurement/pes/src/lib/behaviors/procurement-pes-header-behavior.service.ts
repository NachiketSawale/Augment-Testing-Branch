/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Subscription } from 'rxjs';
import { IPesHeaderEntity } from '../model/entities';

export const PROCUREMENT_PES_HEADER_BEHAVIOR_TOKEN = new InjectionToken<ProcurementPesHeaderBehavior>('procurementContractHeaderBehavior');

@Injectable({
	providedIn: 'root',
})
export class ProcurementPesHeaderBehavior implements IEntityContainerBehavior<IGridContainerLink<IPesHeaderEntity>, IPesHeaderEntity> {
	private subscriptions: Subscription[] = [];

	public onCreate(containerLink: IGridContainerLink<IPesHeaderEntity>): void {}

	public onDestroy(containerLink: IGridContainerLink<IPesHeaderEntity>): void {
		this.subscriptions.forEach((sub) => {
			sub.unsubscribe();
		});
	}
}
