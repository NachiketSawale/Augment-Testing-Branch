/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsPlannedQuantitySlotEntity } from '../model/entities/pps-planned-quantity-slot-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ConfigurationPlannedQuantitySlotBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsPlannedQuantitySlotEntity>, IPpsPlannedQuantitySlotEntity> {

}