/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { PpsPhaseRequirementTemplateDateService } from './phase-requirement-template-data.service';
import { PhaseRequirementTemplateEntity } from '../model/phase-requirement-template-entity.class';

@Injectable({
	providedIn: 'root'
})
export class PpsPhaseRequirementTemplateValidationService extends BaseValidationService<PhaseRequirementTemplateEntity> {

	private dataService = inject(PpsPhaseRequirementTemplateDateService);

	protected generateValidationFunctions(): IValidationFunctions<PhaseRequirementTemplateEntity> {
		return {
			UpstreamGoodsTypeFk: this.validateUpstreamGoodsTypeFk,
			UpstreamGoods: this.validateUpstreamGoods,
			BasUomFk: this.validateBasUomFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<PhaseRequirementTemplateEntity> {
		return this.dataService;
	}

	private validateUpstreamGoodsTypeFk(info: ValidationInfo<PhaseRequirementTemplateEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	private validateUpstreamGoods(info: ValidationInfo<PhaseRequirementTemplateEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	private validateBasUomFk(info: ValidationInfo<PhaseRequirementTemplateEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

}