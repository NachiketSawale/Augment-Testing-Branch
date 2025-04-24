/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ICashProjectionDetailEntity } from '../models/entities/cash-projection-detail-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedCashFlowBehavior<T extends ICashProjectionDetailEntity> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {
	public onCreate(containerLink: IGridContainerLink<T>): void {
		containerLink.uiAddOns.toolbar.deleteItems(['create']);
	}
}
