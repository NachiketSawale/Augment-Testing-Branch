/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import {BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult} from '@libs/platform/data-access';
import {IMaterialPriceConditionEntity} from '@libs/basics/interfaces';
import {BasicsSharedPriceConditionDataService} from './price-condition-data.service';
import {BasicsSharedDataValidationService} from './../../services/basics-shared-data-validation.service';

/**
 * validation service for price condition
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedPriceConditionValidationService<T extends IMaterialPriceConditionEntity,PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends BaseValidationService<IMaterialPriceConditionEntity> {

	private validationUtils = inject(BasicsSharedDataValidationService);

	protected constructor(protected readonly dataService: BasicsSharedPriceConditionDataService<T, PT, PU>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IMaterialPriceConditionEntity> {
		return {
			PrcPriceConditionTypeFk: this.validatePrcPriceConditionTypeFk,
			Value: this.validateValue,
			TotalOc: this.validateTotalOc,
			IsActivated: this.validateIsActivated
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialPriceConditionEntity> {
		return this.dataService;
	}

	protected validatePrcPriceConditionTypeFk(info: ValidationInfo<IMaterialPriceConditionEntity>): Promise<ValidationResult> {
		return new Promise((resolve) => {
			const result = this.validationUtils.isUnique(this.dataService, info, this.dataService.getList(), false);
			if (!result.valid) {
				resolve(result);
			} else {
				this.dataService.recalculate().then(result => {
					resolve(this.validationUtils.createSuccessObject());
				});
			}
		});
	}

	protected async validateValue(info: ValidationInfo<IMaterialPriceConditionEntity>): Promise<ValidationResult> {
		await this.dataService.recalculate();
		return this.validationUtils.createSuccessObject();
	}

	protected async validateTotalOc(info: ValidationInfo<IMaterialPriceConditionEntity>): Promise<ValidationResult> {
		await this.dataService.recalculate();
		return this.validationUtils.createSuccessObject();
	}

	protected async validateIsActivated(info: ValidationInfo<IMaterialPriceConditionEntity>): Promise<ValidationResult> {
		await this.dataService.recalculate();
		return this.validationUtils.createSuccessObject();
	}
}
