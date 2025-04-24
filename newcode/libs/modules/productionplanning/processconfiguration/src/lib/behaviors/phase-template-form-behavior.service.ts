/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {IEntityContainerBehavior, IEntityContainerLink} from '@libs/ui/business-base';
import {
	ProductionplanningProcessconfigurationPhaseTemplateDataService
} from '../services/productionplanning-processconfiguration-phase-template-data.service';
import { PhaseTemplateEntity } from '../model/phase-template-entity.class';

@Injectable({
	providedIn: 'root'
})
export class ProductionplanningProcessconfigurationPhaseTemplateFormBehavior implements IEntityContainerBehavior<IEntityContainerLink<PhaseTemplateEntity>, PhaseTemplateEntity> {
	private _dataService: ProductionplanningProcessconfigurationPhaseTemplateDataService;
	public constructor(phaseTemplateDataService: ProductionplanningProcessconfigurationPhaseTemplateDataService) {
		this._dataService = phaseTemplateDataService;
	}

	public onCreate() {
	}
}