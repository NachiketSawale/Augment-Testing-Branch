/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsPhaseDateSlotEntity } from '../model/entities/pps-phase-date-slot-entity.interface';


@Injectable({
	providedIn: 'root'
})
export class ConfigurationPhaseDateSlotBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsPhaseDateSlotEntity>, IPpsPhaseDateSlotEntity> {

}