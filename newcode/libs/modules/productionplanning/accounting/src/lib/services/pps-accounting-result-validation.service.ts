import { PlatformTranslateService } from '@libs/platform/common';
import { inject, Injectable } from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo,
	ValidationResult
} from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

import { IResultEntity } from '../model/models';
import { PpsAccountingResultDataService } from './pps-accounting-result-data.service';

@Injectable({
	providedIn: 'root'
})
export class PpsAccountingResultValidationService extends BaseValidationService<IResultEntity> {

	private translateService: PlatformTranslateService = inject(PlatformTranslateService);
	private validationUtils = inject(BasicsSharedDataValidationService);

	public constructor(private resultDataService: PpsAccountingResultDataService) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IResultEntity> {
		return {
			ComponentTypeFk: this.validateComponentTypeFk,
			Result: this.validateResult,
			QuantityFormula: this.validateFormula,
			QuantityFormula2: this.validateFormula,
			QuantityFormula3: this.validateFormula,
			MaterialGroupFk: this.asyncValidateMaterialGroupFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IResultEntity> {
		return this.resultDataService;
	}

	private validateComponentTypeFk(info: ValidationInfo<IResultEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}

	private validateResult(info: ValidationInfo<IResultEntity>): ValidationResult {
		if (info.entity.ComponentTypeFk < 3) {
			return this.validationUtils.isMandatory(info);
		}
		return this.validationUtils.createSuccessObject();
	}

	private validateFormula(info: ValidationInfo<IResultEntity>): ValidationResult {
		let script = '';
		script += 'let value = 1;\n';
		script += info.value;
		try {
			eval(wrap(script));
			return this.validationUtils.createSuccessObject();
		} catch (e) {
			return  this.validationUtils.createErrorObject(e as string);
		}

		function wrap(script: string): string {
			return '(function(){\n' + script + '\n})()';
		}
	}

	private async asyncValidateMaterialGroupFk(info: ValidationInfo<IResultEntity>): Promise<ValidationResult> {
		const value = info.value as number;
		if (value < 0) {
			return this.validationUtils.createErrorObject({ key: 'basics.material.error.materialGroupSelectError' });
		}
		return this.validationUtils.createSuccessObject();
	}
}