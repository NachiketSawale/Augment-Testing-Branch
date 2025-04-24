/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable, InjectionToken} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IPPSItemEntity} from '../model/entities/pps-item-entity.interface';

export const PPS_ITEM_STRUCTURE_BEHAVIOR_TOKEN = new InjectionToken<PpsItemStructureBehavior>('ppsItemStructureBehavior');

@Injectable({
    providedIn: 'root'
})
export class PpsItemStructureBehavior implements IEntityContainerBehavior<IGridContainerLink<IPPSItemEntity>, IPPSItemEntity> {
}