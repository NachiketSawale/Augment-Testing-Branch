/*
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { BasicsBillingSchemaBillingLineType, CommonBillingSchemaDataService, ICommonBillingSchemaEntity } from '../../billing-schema';
import { inject } from '@angular/core';
import { BasicsSharedDigitsAfterDecimalRounding } from '../../rounding/services/basics-shared-digits-after-decimal-rounding.service';

/**
 * common billing schema validation service
 */
export  class CommonBillingSchemaValidationService<T extends ICommonBillingSchemaEntity,  PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends BaseValidationService<T>  {
	private readonly digitsAfterDecimalRounding = inject(BasicsSharedDigitsAfterDecimalRounding);
	/**
	 *
	 * @param dataService
	 */
	protected constructor(protected dataService: CommonBillingSchemaDataService<T, PT, PU>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			ControllingUnitFk: this.validateControllingUnitFk,
			Value:this.validateValue
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	protected validateControllingUnitFk(info: ValidationInfo<T>) {
		return new Promise<ValidationResult>(resolve => {
			resolve(new ValidationResult());
			//pes and invoice module need to override this function
		});
	}

	protected validateValue(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = info.value === null ? 0 : info.value as number;
		if (entity.BillingLineTypeFk === BasicsBillingSchemaBillingLineType.earlyPaymentDiscountVAT) {
			entity.ResultOc = value;
			const parentItem = this.dataService.parentService.getSelectedEntity();
			let exchangeRate = 1;
			if (parentItem && parentItem.Id) {
				exchangeRate = this.dataService.getExchangeRate(parentItem);
			}
			entity.Result = this.digitsAfterDecimalRounding.round(value / exchangeRate, 2);
		}
		return new ValidationResult();
	}

}