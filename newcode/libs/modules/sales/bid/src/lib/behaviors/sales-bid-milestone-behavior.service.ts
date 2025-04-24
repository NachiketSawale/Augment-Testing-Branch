/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IBidMilestoneEntity } from '@libs/sales/interfaces';

@Injectable({
    providedIn: 'root'
})
export class SalesBidMilestoneBehavior implements IEntityContainerBehavior<IGridContainerLink<IBidMilestoneEntity>, IBidMilestoneEntity> {
}