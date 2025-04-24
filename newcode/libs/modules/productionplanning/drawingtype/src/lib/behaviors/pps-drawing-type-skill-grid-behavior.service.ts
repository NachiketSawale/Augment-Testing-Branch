/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {IPpsDrawingTypeSkillEntity} from '../model/entities/pps-drawing-type-skill-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsDrawingTypeSkillGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsDrawingTypeSkillEntity>, IPpsDrawingTypeSkillEntity> {

}