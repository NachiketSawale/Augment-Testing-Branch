/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IFormContainerLink } from '@libs/ui/business-base';
import {IPpsDrawingTypeSkillEntity} from '../model/entities/pps-drawing-type-skill-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsDrawingTypeSkillFormBehavior implements IEntityContainerBehavior<IFormContainerLink<IPpsDrawingTypeSkillEntity>, IPpsDrawingTypeSkillEntity> {

}