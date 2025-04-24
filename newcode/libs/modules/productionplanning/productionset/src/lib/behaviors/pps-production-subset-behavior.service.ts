/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { PpsProductionSubsetDataService } from '../services/pps-production-subset-data.service';
import { IPpsProductionSubsetEntity } from '../model/entities/external_entities/pps-production-subset-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsProductionSubsetBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsProductionSubsetEntity>, IPpsProductionSubsetEntity> {

	private readonly dataService: PpsProductionSubsetDataService;
	

	public constructor() {
		this.dataService = inject(PpsProductionSubsetDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPpsProductionSubsetEntity>): void {	}

}