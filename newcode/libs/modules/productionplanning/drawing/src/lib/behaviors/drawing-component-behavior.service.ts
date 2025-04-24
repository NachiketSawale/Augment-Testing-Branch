/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { DrawingComponentDataService } from '../services/drawing-component-data.service';
import { IEngDrawingComponentEntity } from '../model/entities/eng-drawing-component-entity.interface';

export class DrawingComponentBehavior implements IEntityContainerBehavior<IGridContainerLink<IEngDrawingComponentEntity>, IEngDrawingComponentEntity> {

	public constructor(private dataService: DrawingComponentDataService) {
	}

	public onCreate(containerLink: IGridContainerLink<IEngDrawingComponentEntity>): void {
	}
}