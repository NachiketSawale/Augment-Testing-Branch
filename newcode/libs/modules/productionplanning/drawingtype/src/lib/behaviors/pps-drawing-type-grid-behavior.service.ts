/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {IPpsDrawingTypeEntity} from '../model/entities/pps-drawing-type-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsDrawingTypeGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsDrawingTypeEntity>, IPpsDrawingTypeEntity> {

}