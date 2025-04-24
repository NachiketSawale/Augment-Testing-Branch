/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ControllingActualsCostHeaderDataService } from '../services/controlling-actuals-cost-header-data.service';
import {ICompanyCostHeaderEntity} from '../model/entities/company-cost-header-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ControllingActualsCostHeaderBehavior implements IEntityContainerBehavior<IGridContainerLink<ICompanyCostHeaderEntity>, ICompanyCostHeaderEntity> {

	private dataService: ControllingActualsCostHeaderDataService;

	public constructor() {
		this.dataService = inject(ControllingActualsCostHeaderDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ICompanyCostHeaderEntity>): void {

	}

}