/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Subscription } from 'rxjs';
import { IChangeEntity } from '../model/entities/change-entity.interface';

export const PROCUREMENT_CONTRACT_PROJECT_CHANGE_BEHAVIOR_TOKEN = new InjectionToken<ProcurementContractProjectChangeBehavior>('procurementContractProjectChangeBehavior');
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractProjectChangeBehavior implements IEntityContainerBehavior<IGridContainerLink<IChangeEntity>, IChangeEntity> {
	private subscriptions: Subscription[] = [];
	public onCreate(containerLink: IGridContainerLink<IChangeEntity>): void {
		//todo-The enumeration class does not have a value for the jump button, and the value is set here after being added
		// containerLink.uiAddOns.toolbar.deleteItems(
		// 	EntityContainerCommand
		// ]);
	}
	public onDestroy(containerLink: IGridContainerLink<IChangeEntity>): void {
		this.subscriptions.forEach((sub) => {
			sub.unsubscribe();
		});
	}
}