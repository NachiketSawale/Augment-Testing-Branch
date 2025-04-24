/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable, InjectionToken} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IPPSItemEntity} from '../model/entities/pps-item-entity.interface';

export const PPS_ITEM_BEHAVIOR_TOKEN = new InjectionToken<PpsItemBehavior>('ppsItemBehavior');

@Injectable({
    providedIn: 'root'
})
export class PpsItemBehavior implements IEntityContainerBehavior<IGridContainerLink<IPPSItemEntity>, IPPSItemEntity> {
}