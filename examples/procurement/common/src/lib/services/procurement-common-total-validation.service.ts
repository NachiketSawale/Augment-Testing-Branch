/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ProcurementBaseValidationService } from '@libs/procurement/shared';
import { ProcurementCommonTotalDataService } from './procurement-common-total-data.service';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';


/**
 * Procurement common total validation service
 */
export abstract class ProcurementCommonTotalValidationService<T extends IPrcCommonTotalEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends ProcurementBaseValidationService<T> {

	/**
	 *
	 * @param dataService
	 */
	protected constructor(protected dataService: ProcurementCommonTotalDataService<T, PT, PU>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			TotalTypeFk: this.validateTotalTypeFk,
			ValueNet: this.validateValueNet,
			ValueNetOc: this.validateValueNetOc,
			ValueTax: this.validateValueTax,
			ValueTaxOc: this.validateValueTaxOc,
			Gross: this.validateGross,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	protected async validateTotalTypeFk(info: ValidationInfo<T>) {
		if (info.value === 0 || info.value === null) {
			return this.validationUtils.createErrorObject('cloud.common.emptyOrNullValueErrorMessage');
		}

		if (this.checkUniqueTotalType(info.entity.Id, info.value as number)) {
			// refresh totals after saved not here
			await this.dataService.processData(info.entity);

			//In AngularJs code it will call the update to recalculate the totals. In Angular just make it simple.
			//The totals should be recalculated after saved or clicking the recalculate button.
			return this.validationUtils.createSuccessObject();
		} else {
			return this.validationUtils.createErrorObject({ key: 'cloud.common.uniqueValueErrorMessage', params: { object: this.translationService.instant('basics.customize.totaltype').text } });
		}
	}

	private checkUniqueTotalType(id: number, totalTypeId: number) {
		//In AngularJs code it will check the unique value by calling the API,
		// but the checking done in frontend should be enough.
		return this.dataService.getList().findIndex((e) => e.Id !== id && e.TotalTypeFk === totalTypeId) === -1;
	}

	protected validateValueNet(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = info.value === null ? 0 : (info.value as number);
		const exchangeRate = this.dataService.getExchangeRate();

		const vatPercent = this.dataService.getVatPercent();
		entity.ValueNet = value;
		entity.ValueTax = (entity.ValueNet * vatPercent) / 100;
		entity.ValueNetOc = entity.ValueNet * exchangeRate;
		entity.ValueTaxOc = (entity.ValueNetOc * vatPercent) / 100;
		entity.Gross = entity.ValueNet + entity.ValueTax;
		entity.GrossOc = entity.ValueNetOc + entity.ValueTaxOc;

		return this.validationUtils.createSuccessObject();
	}

	protected validateValueNetOc(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = info.value === null ? 0 : (info.value as number);
		const exchangeRate = this.dataService.getExchangeRate();
		const valueNet = exchangeRate ? value / exchangeRate : 0;

		return this.validateValueNet(new ValidationInfo<T>(entity, valueNet, 'ValueNetOc'));
	}

	protected validateValueTax(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = info.value === null ? 0 : (info.value as number);
		// TODO: Is this still required?
		/*const exchangeRate = this.dataService.getExchangeRate({
			id: entity.Id
		});*/

		const vatPercent = this.dataService.getVatPercent();
		entity.ValueTax = value;
		entity.ValueTaxOc = entity.ValueTax * vatPercent;
		entity.Gross = entity.ValueNet + entity.ValueTax;
		entity.GrossOc = entity.ValueNetOc + entity.ValueTaxOc;
		return this.validationUtils.createSuccessObject();
	}

	protected validateValueTaxOc(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = info.value === null ? 0 : (info.value as number);
		// TODO: Is this still required?
		/*const exchangeRate = this.dataService.getExchangeRate({
			id: entity.Id
		});*/

		const vatPercent = this.dataService.getVatPercent();
		entity.ValueTaxOc = value;
		entity.ValueTax = entity.ValueNetOc / vatPercent;
		entity.Gross = entity.ValueNet + entity.ValueTax;
		entity.GrossOc = entity.ValueNetOc + entity.ValueTaxOc;
		return this.validationUtils.createSuccessObject();
	}

	protected validateGross(info: ValidationInfo<T>) {
		//const entity = info.entity;
		const value = info.value === null ? 0 : (info.value as number);
		// TODO: Is this still required?
		/*const exchangeRate = this.dataService.getExchangeRate({
			id: entity.Id
		});*/

		const vatPercent = this.dataService.getVatPercent();
		const valueNet = value / (1 + vatPercent / 100);
		return this.validateValueNet(new ValidationInfo<T>(info.entity, valueNet, 'ValueNet'));
	}

	protected validateGrossOc(info: ValidationInfo<T>) {
		//const entity = info.entity;
		const value = info.value === null ? 0 : (info.value as number);
		// TODO: Is this still required?
		/*const exchangeRate = this.dataService.getExchangeRate({
			id: entity.Id
		});*/

		const vatPercent = this.dataService.getVatPercent();
		const valueNetOc = value / (1 + vatPercent / 100);
		return this.validateValueNetOc(new ValidationInfo<T>(info.entity, valueNetOc, 'ValueNetOc'));
	}
}
