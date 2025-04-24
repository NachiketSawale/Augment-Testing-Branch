/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ProductionplanningProcessconfigurationProcessTemplateDataService } from './productionplanning-processconfiguration-process-template-data.service';
import { ProcessTemplateEntity } from '../model/process-template-entity.class';

@Injectable({
	providedIn: 'root'
})
export class PpsProcessTemplateValidationService extends BaseValidationService<ProcessTemplateEntity> {

	private dataService = inject(ProductionplanningProcessconfigurationProcessTemplateDataService);

	protected generateValidationFunctions(): IValidationFunctions<ProcessTemplateEntity> {
		return {
			ProcessTypeFk: this.validateProcessTypeFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ProcessTemplateEntity> {
		return this.dataService;
	}

	private validateProcessTypeFk(info: ValidationInfo<ProcessTemplateEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

}