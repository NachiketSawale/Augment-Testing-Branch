/*
 * Copyright(c) RIB Software GmbH
 */


import { DrawingDataService } from '../services/drawing-data.service';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ISearchPayload } from '@libs/platform/common';
import { IEngDrawingEntity } from '../model/entities/eng-drawing-entity.interface';

export class DrawingBehavior implements IEntityContainerBehavior<IGridContainerLink<IEngDrawingEntity>, IEngDrawingEntity> {


	private searchPayload: ISearchPayload = {
		executionHints: false,
		filter: '',
		includeNonActiveItems: false,
		isReadingDueToRefresh: false,
		pageNumber: 0,
		pageSize: 100,
		pattern: '',
		pinningContext: [],
		projectContextId: null,
		useCurrentClient: true
	};

	public constructor(private dataService: DrawingDataService) {
	}

	public onCreate(containerLink: IGridContainerLink<IEngDrawingEntity>): void {
		if (!this.dataService.any()) { //TODO: https://rib-40.atlassian.net/browse/DEV-12010
			this.dataService.refresh(this.searchPayload).then(data => containerLink.gridData = data.dtos);
		}
	}

}