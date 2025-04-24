/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { PpsFabricationunitDataService } from '../services/pps-fabricationunit-data.service';
import { IPpsFabricationUnitEntity } from '../model/entities/pps-fabrication-unit-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsFabricationunitBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsFabricationUnitEntity>,
	IPpsFabricationUnitEntity> {

	private dataService: PpsFabricationunitDataService;
	

	public constructor() {
		this.dataService = inject(PpsFabricationunitDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPpsFabricationUnitEntity>) {}
}