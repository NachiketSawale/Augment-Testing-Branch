/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ProductionplanningEventconfigurationEventSequenceConfigDataService } from './event-sequence-config-data.service';
import { EventSequenceConfigEntity } from '../model/entities/event-sequence-config-entity.class';
import { PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class PpsEventSequenceConfigValidationService extends BaseValidationService<EventSequenceConfigEntity> {

	private dataService = inject(ProductionplanningEventconfigurationEventSequenceConfigDataService);
	private translateService: PlatformTranslateService = inject(PlatformTranslateService);

	protected generateValidationFunctions(): IValidationFunctions<EventSequenceConfigEntity> {
		return {
			MaterialGroupFk: this.validateMaterialGroupFk,
			SiteFk: this.validateSiteFk,
			QuantityFormula: this.validateQuantityFormula,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<EventSequenceConfigEntity> {
		return this.dataService;
	}

	private validateMaterialGroupFk(info: ValidationInfo<EventSequenceConfigEntity>): ValidationResult {
		const result = this.validateIsMandatory(info);
		if (!result.valid) {
			return result;
		}

		if (info.value as number < 0) {
			return new ValidationResult(this.translateService.instant('basics.material.error.materialGroupSelectError').text);
		} else {
			return new ValidationResult();
		}
	}

	private validateSiteFk(info: ValidationInfo<EventSequenceConfigEntity>): ValidationResult {
		if (!info.entity.IsTemplate) {
			return this.validateIsMandatory(info);
		}
		return new ValidationResult();
	}

	private validateQuantityFormula(info: ValidationInfo<EventSequenceConfigEntity>): ValidationResult {
		return this.formulaValidation(info);
	}

	private formulaValidation = (info: ValidationInfo<EventSequenceConfigEntity>) => {
		let script = '';
		script += 'var value = 1;\n';

		script += info.value;
		const res = new ValidationResult();
		try {
			eval(this.wrap(script));
			res.valid = true;
			res.apply = true;
		} catch (e) {
			res.valid = false;
			res.apply = true;
			res.error = (e as Error).message;
		}
		return res;
	};

	private wrap = (code: string) => '(function(){\n' + code + '\n})()';

}