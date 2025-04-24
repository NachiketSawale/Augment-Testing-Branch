

import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';

import { IRuleEntity } from '../model/models';
import { PpsAccountingRuleDataService } from './pps-accounting-rule-data.service';

@Injectable({
	providedIn: 'root'
})
export class PpsAccountingRuleValidationService extends BaseValidationService<IRuleEntity> {

	private validationUtils = inject(BasicsSharedDataValidationService);
	public constructor(private ruleDataService: PpsAccountingRuleDataService) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IRuleEntity> {
		return {
			RuleTypeFk: this.validateRuleTypeFk,
			ImportFormatFk: this.validateImportFormatFk,
			MatchFieldFk: this.validateMatchFieldFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IRuleEntity> {
		return this.ruleDataService;
	}

	private validateRuleTypeFk(info: ValidationInfo<IRuleEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}

	private validateImportFormatFk(info: ValidationInfo<IRuleEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}

	private validateMatchFieldFk(info: ValidationInfo<IRuleEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}
}