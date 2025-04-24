/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { PpsProductionPlaceDataService } from '../services/pps-production-place-data.service';
import { PpsProductionPlaceEntity } from '@libs/productionplanning/shared';

@Injectable({
	providedIn: 'root',
})
export class PpsProductionPlaceGridBehavior implements IEntityContainerBehavior<IGridContainerLink<PpsProductionPlaceEntity>, PpsProductionPlaceEntity> {
	public constructor(private dataService: PpsProductionPlaceDataService) {}

	public onCreate(containerLink: IGridContainerLink<PpsProductionPlaceEntity>) {}
}
