/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { DrawingSkillDataService } from '../services/drawing-skill-data.service';
import { IEngDrawingSkillEntity } from '../model/entities/eng-drawing-skill-entity.interface';


export class DrawingSkillBehavior implements IEntityContainerBehavior<IGridContainerLink<IEngDrawingSkillEntity>, IEngDrawingSkillEntity> {

	public constructor(private dataService: DrawingSkillDataService) {
	}

	public onCreate(containerLink: IGridContainerLink<IEngDrawingSkillEntity>): void {
	}

}