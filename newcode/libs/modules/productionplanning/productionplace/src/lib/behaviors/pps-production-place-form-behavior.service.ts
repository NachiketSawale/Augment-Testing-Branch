/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IEntityContainerLink } from '@libs/ui/business-base';
import { PpsProductionPlaceDataService } from '../services/pps-production-place-data.service';
import { PpsProductionPlaceEntity } from '@libs/productionplanning/shared';

@Injectable({
	providedIn: 'root',
})
export class PpsProductionPlaceFormBehavior implements IEntityContainerBehavior<IEntityContainerLink<PpsProductionPlaceEntity>, PpsProductionPlaceEntity> {
	public constructor(private dataService: PpsProductionPlaceDataService) {}

	public onCreate() {}
}
