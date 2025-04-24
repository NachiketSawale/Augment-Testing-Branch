/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { PhaseTemplateEntity } from '../model/phase-template-entity.class';
import {
	ProductionplanningProcessconfigurationPhaseTemplateDataService
} from '../services/productionplanning-processconfiguration-phase-template-data.service';

@Injectable({
	providedIn: 'root'
})
export class ProductionplanningProcessconfigurationPhaseTemplateGridBehavior implements IEntityContainerBehavior<IGridContainerLink<PhaseTemplateEntity>, PhaseTemplateEntity> {
	private _dataService: ProductionplanningProcessconfigurationPhaseTemplateDataService;

	public constructor(phaseTemplateDataService: ProductionplanningProcessconfigurationPhaseTemplateDataService) {
		this._dataService = phaseTemplateDataService;
	}

	public onCreate(): void {
	}
}
