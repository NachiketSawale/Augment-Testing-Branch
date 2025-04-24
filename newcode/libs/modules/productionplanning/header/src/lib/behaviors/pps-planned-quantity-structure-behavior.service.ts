/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import { IPpsPlannedQuantityEntity } from '@libs/productionplanning/formulaconfiguration';

@Injectable({
	providedIn: 'root'
})
export class PpsPlannedQuantityStructureBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsPlannedQuantityEntity>, IPpsPlannedQuantityEntity> {
}