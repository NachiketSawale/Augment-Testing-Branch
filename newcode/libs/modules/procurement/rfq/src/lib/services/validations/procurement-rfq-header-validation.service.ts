/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { ProcurementRfqHeaderMainDataService } from '../procurement-rfq-header-main-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { PrcSharedPrcConfigLookupService } from '@libs/procurement/shared';
import * as _ from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class RfqHeaderValidationService extends BaseValidationService<IRfqHeaderEntity> {
	private readonly headerDataService: ProcurementRfqHeaderMainDataService = inject(ProcurementRfqHeaderMainDataService);
	private readonly validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	private readonly translationService: PlatformTranslateService = inject(PlatformTranslateService);
	private readonly prcConfigLookupService = inject(PrcSharedPrcConfigLookupService);

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IRfqHeaderEntity> {
		return this.headerDataService;
	}

	protected override generateValidationFunctions(): IValidationFunctions<IRfqHeaderEntity> {
		return {
			Code: [this.validateCode, this.asyncValidateCode],
			PlannedEnd: this.validatePlannedEnd,
			PlannedStart: this.validatePlannedStart,
			PrcConfigurationFk: this.validatePrcConfigurationFk,
			PrcStrategyFk: this.validatePrcStrategyFk,
			PrcContractFk: this.validatePrcContractTypeFk,
			RfqTypeFk: this.validateRfqTypeFk,
		};
	}

	public validatePlannedEnd(info: ValidationInfo<IRfqHeaderEntity>, apply?: boolean): ValidationResult {
		return this.validationService.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.PlannedEnd ? info.entity.PlannedEnd.toString() : '', 'PlannedEnd');
	}

	public validatePlannedStart(info: ValidationInfo<IRfqHeaderEntity>, apply?: boolean): ValidationResult {
		return this.validationService.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.PlannedStart ? info.entity.PlannedStart.toString() : '', 'PlannedStart');
	}

	public validateCode(info: ValidationInfo<IRfqHeaderEntity>, apply?: boolean): ValidationResult {
		const result = this.validationService.isMandatory(info, 'cloud.common.code');
		if (apply) {
			result.apply = true;
		}
		return result;
	}

	protected asyncValidateCode(info: ValidationInfo<IRfqHeaderEntity>): Promise<ValidationResult> {
		return this.validationService.isAsyncUnique(info, 'procurement/rfq/header/isreferenceunique', 'cloud.common.code').then((response) => {
			const entityValue = _.get(info.entity, info.field);
			if (!entityValue && _.isObject(response)) {
				response.apply = true;
			}
			return response;
		});
	}

	public validateProjectFk(info: ValidationInfo<IRfqHeaderEntity>, apply?: boolean): ValidationResult {
		// TODO: validateProjectFk
		const result = this.validationService.isMandatory(info, 'cloud.common.code');
		if (apply) {
			result.apply = true;
		}
		return result;
	}

	protected validatePrcStrategyFk(info: ValidationInfo<IRfqHeaderEntity>): ValidationResult {
		return this.requiredValidator(info);
	}

	protected validatePrcContractTypeFk(info: ValidationInfo<IRfqHeaderEntity>): ValidationResult {
		return this.requiredValidator(info);
	}

	protected validateRfqTypeFk(info: ValidationInfo<IRfqHeaderEntity>): ValidationResult {
		return this.requiredValidator(info);
	}

	public validatePrcConfigurationFk(info: ValidationInfo<IRfqHeaderEntity>, apply?: boolean): ValidationResult {
		// TODO: validatePrcConfigurationFk
		const result = new ValidationResult();
		result.valid = true;
		result.apply = true;
		this.prcConfigLookupService.getItemByKey({ id: info.value as number }).subscribe((prcConfigurationEntity) => {
			if (prcConfigurationEntity) {
				info.entity.PrcConfigurationFk = prcConfigurationEntity.Id;
				info.entity.PaymentTermAdFk = prcConfigurationEntity.PaymentTermAdFk;
				info.entity.PaymentTermPaFk = prcConfigurationEntity.PaymentTermPaFk;
				info.entity.PaymentTermAdFk = prcConfigurationEntity.PaymentTermAdFk;
				return result;
			} else {
				result.valid = false;
				result.apply = false;
				return result;
			}
		});
		return result;
	}

	private requiredValidator(info: ValidationInfo<IRfqHeaderEntity>) {
		const result = new ValidationResult();
		result.apply = true;
		if (_.isUndefined(info.value) || _.isNull(info.value) || info.value === -1 || _.isEmpty(info.value)) {
			result.valid = false;
			result.error = this.translationService.instant({ key: 'cloud.common.emptyOrNullValueErrorMessage', params: { fieldName: info.field } }).text;
		}
		return result;
	}
}
