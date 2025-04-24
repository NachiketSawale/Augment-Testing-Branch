/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { DrawingStackDataService } from '../services/drawing-stack-data.service';
import { IEngStackEntity } from '../model/entities/eng-stack-entity.interface';

export class DrawingStackBehavior implements IEntityContainerBehavior<IGridContainerLink<IEngStackEntity>, IEngStackEntity> {

	public constructor(private dataService: DrawingStackDataService) {
	}

	public onCreate(containerLink: IGridContainerLink<IEngStackEntity>): void {
	}

}