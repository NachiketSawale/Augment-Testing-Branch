/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ProductionplanningProcessconfigurationPhaseTemplateDataService } from './productionplanning-processconfiguration-phase-template-data.service';
import { PhaseTemplateEntity } from '../model/phase-template-entity.class';

@Injectable({
	providedIn: 'root'
})
export class PpsPhaseTemplateValidationService extends BaseValidationService<PhaseTemplateEntity> {

	private dataService = inject(ProductionplanningProcessconfigurationPhaseTemplateDataService);

	protected generateValidationFunctions(): IValidationFunctions<PhaseTemplateEntity> {
		return {
			PhaseTypeFk: this.validatePhaseTypeFk,
			PsdRelationkindFk: this.validatePsdRelationkindFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<PhaseTemplateEntity> {
		return this.dataService;
	}

	private validatePhaseTypeFk(info: ValidationInfo<PhaseTemplateEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	private validatePsdRelationkindFk(info: ValidationInfo<PhaseTemplateEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

}