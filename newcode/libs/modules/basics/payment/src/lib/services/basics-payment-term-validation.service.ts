/*
 * Copyright(c) RIB Software GmbH
 */
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IPaymentTermEntity } from '../model/entities/payment-term-entity.interface';
import { inject, Injectable } from '@angular/core';
import { PaymentTermDataService } from './basics-payment-main.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class BasicsPaymentTermValidationService extends BaseValidationService<IPaymentTermEntity> {
	private readonly dataService = inject(PaymentTermDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<IPaymentTermEntity> {
		return {
			IsDefault: this.uniqueDefaultFlag,
			IsDefaultCreditor: this.uniqueDefaultFlag,
			IsDefaultDebtor: this.uniqueDefaultFlag,
			Code: this.validateCode,
			NetDays: this.validateNetDays,
			DiscountDays: this.validateDiscountDays,
			DiscountPercent: this.validateDiscountPercent,
			CalculationTypeFk: this.validateCalculationTypeFk,
			DayOfMonth: this.validateDayOfMonth,
			Sorting: this.validateSorting,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPaymentTermEntity> {
		return this.dataService;
	}

	private validateCode(info: ValidationInfo<IPaymentTermEntity>): ValidationResult {
		return this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList());
	}

	private validateNetDays(info: ValidationInfo<IPaymentTermEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info, 'basics.payment.netDays');
	}

	private validateDiscountDays(info: ValidationInfo<IPaymentTermEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info, 'basics.payment.DiscountDays');
	}

	private validateDiscountPercent(info: ValidationInfo<IPaymentTermEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info, 'basics.payment.DiscountPercent');
	}

	private validateCalculationTypeFk(info: ValidationInfo<IPaymentTermEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info, 'basics.payment.CalculationType');
	}

	private validateDayOfMonth(info: ValidationInfo<IPaymentTermEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info, 'basics.payment.DayOfMonth');
	}

	private validateSorting(info: ValidationInfo<IPaymentTermEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info, 'cloud.common.entitySorting');
	}

	private uniqueDefaultFlag(info: ValidationInfo<IPaymentTermEntity>): ValidationResult {
		const fieldName = info.field as keyof IPaymentTermEntity;
		const checkedPaymentTerms = this.dataService.getList().filter((paymentTerm) => paymentTerm[fieldName]);
		checkedPaymentTerms.forEach((item) => this.setField(item, fieldName, false));
		this.setField(info.entity, fieldName, info.value as boolean);

		this.dataService.entitiesUpdated(checkedPaymentTerms);
		this.dataService.setModified(checkedPaymentTerms);

		return new ValidationResult();
	}

	private setField<T>(item: T, fieldName: keyof T, value: T[keyof T]): void {
		item[fieldName] = value;
	}
}
