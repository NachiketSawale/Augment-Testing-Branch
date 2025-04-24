/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { DrawingRevisionDataService } from '../services/drawing-revision-data.service';
import { IEngDrwRevisionEntity } from '../model/entities/eng-drw-revision-entity.interface';


export class DrawingRevisionBehavior implements IEntityContainerBehavior<IGridContainerLink<IEngDrwRevisionEntity>, IEngDrwRevisionEntity> {

	public constructor(private dataService: DrawingRevisionDataService) {
	}

	public onCreate(containerLink: IGridContainerLink<IEngDrwRevisionEntity>): void {

	}

}