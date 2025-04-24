/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { inject } from '@angular/core';
import { bignumber, round } from 'mathjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaymentTermCalculationService } from '../../payment-term';
import { IPaymentScheduleBaseEntity } from '@libs/basics/interfaces';
import { BasicsSharedDataValidationService } from '../../services/basics-shared-data-validation.service';
import { BasicsSharedPaymentTermLookupService } from '../../lookup-services/payment-term-lookup.service';
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService } from '@libs/platform/common';
import { IBasicsSharedPaymentScheduleDataServiceInterface } from './interfaces/payment-schedule-data-service.interface';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { BasicsSharedDecimalPlacesEnum as decimalPlacesEnum } from '../../interfaces/basics-shared-decimal-places.enum';

/**
 * Payment schedule basics validation service
 */
export abstract class BasicsSharedPaymentScheduleValidationService<
	T extends IPaymentScheduleBaseEntity,
	PT extends IEntityIdentification,
	PU extends CompleteIdentification<PT>>
	extends BaseValidationService<T> {
	protected readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);
	protected readonly paymentTermCalculationService = inject(PaymentTermCalculationService);
	protected readonly paymentTermLookupService = inject(BasicsSharedPaymentTermLookupService);

	protected constructor(protected readonly dataService: IBasicsSharedPaymentScheduleDataServiceInterface<T, PT, PU>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			Code: this.validateCode,
			IsDone: this.validateIsDone,
			PsdScheduleFk: this.validatePsdScheduleFk,
			PsdActivityFk: this.validatePsdActivityFk,
			DateRequest: this.validateDateRequest,
			BasPaymentTermFk: this.validateBasPaymentTermFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	protected validateCode(info: ValidationInfo<T>) {
		const list = this.dataService.getList();
		return this.validationUtils.isUniqueAndMandatory(info, list);
	}

	protected validateIsDone(info: ValidationInfo<T>) {
		info.entity.IsDone = info.value as boolean;
		this.dataService.updateReadOnly(info.entity);
		return this.validationUtils.createSuccessObject();
	}

	protected validatePsdScheduleFk(info: ValidationInfo<T>) {
		const entity = info.entity;
		entity.PsdScheduleFk = info.value as number;
		entity.PsdActivityFk = undefined;
		entity.MeasuredPerformance = 0;
		this.dataService.updateReadOnly(entity);
		return this.validationUtils.createSuccessObject();
	}

	protected async validatePsdActivityFk(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = info.value as number;

		entity.MeasuredPerformance = !value ? 0 : await this.getActivityProgress(value);
		return this.validationUtils.createSuccessObject();
	}

	protected async validateDateRequest(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = info.value as Date;

		const isMandatoryResult = this.validationUtils.isMandatory(info);
		if (!isMandatoryResult.valid) {
			return isMandatoryResult;
		}

		if (!entity.BasPaymentTermFk) {
			return this.validationUtils.createSuccessObject();
		}

		entity.DateRequest = value.toISOString();
		await this.recalculateDatePayment(entity);

		return this.validationUtils.createSuccessObject();
	}

	protected async validateBasPaymentTermFk(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = info.value as number;

		if (!value) {
			return this.validationUtils.createSuccessObject();
		}

		entity.BasPaymentTermFk = value;
		await this.recalculateDatePayment(entity);

		return this.validationUtils.createSuccessObject();
	}

	private async getActivityProgress(activityId: number) {
		const params: HttpParams = new HttpParams().set('activityId', activityId);
		return firstValueFrom(this.http.get<number>(this.configService.webApiBaseUrl + 'procurement/common/prcpaymentschedule/getactivityprogressofpaymentschedule', {params: params}));
	}

	protected validatePercentRange(entity: T, value: number, field: string) {
		let result = this.validationUtils.createSuccessObject();

		if (value > 100) {
			result = this.validationUtils.createErrorObject('procurement.common.paymentSchedule.paymentScheduleValueRangeErrorMessage');
			this.dataService.addInvalid(entity, {
				field: field,
				result: result
			});
		} else {
			this.dataService.removeInvalid(entity, {
				field: field,
				result: result
			});
		}

		return result;
	}

	protected calculateAmountFields(entity: T, value: number, field: AmountFieldsType) {
		const rate = this.dataService.getExchangeRate();
		const vatPercent = this.dataService.getVatPercent();

		switch (field) {
			case 'AmountNet':
				entity.AmountGross = round(bignumber(value).mul(vatPercent), decimalPlacesEnum.decimalPlaces2).toNumber();
				entity.AmountNet = value;
				entity.AmountNetOc = round(bignumber(value).mul(rate), decimalPlacesEnum.decimalPlaces2).toNumber();
				entity.AmountGrossOc = round(bignumber(entity.AmountGross).mul(rate), decimalPlacesEnum.decimalPlaces2).toNumber();
				break;
			case 'AmountNetOc':
				entity.AmountGrossOc = round(bignumber(value).mul(vatPercent), decimalPlacesEnum.decimalPlaces2).toNumber();
				entity.AmountNetOc = value;
				entity.AmountNet = round(bignumber(value).div(rate), decimalPlacesEnum.decimalPlaces2).toNumber();
				entity.AmountGross = round(bignumber(entity.AmountGrossOc).div(rate), decimalPlacesEnum.decimalPlaces2).toNumber();
				break;
			case 'AmountGross':
				entity.AmountNet = round(bignumber(value).div(vatPercent), decimalPlacesEnum.decimalPlaces2).toNumber();
				entity.AmountGross = value;
				entity.AmountGrossOc = round(bignumber(value).mul(rate), decimalPlacesEnum.decimalPlaces2).toNumber();
				entity.AmountNetOc = round(bignumber(entity.AmountNet).mul(rate), decimalPlacesEnum.decimalPlaces2).toNumber();
				break;
			case 'AmountGrossOc':
				entity.AmountNetOc = round(bignumber(value).div(vatPercent), decimalPlacesEnum.decimalPlaces2).toNumber();
				entity.AmountGrossOc = value;
				entity.AmountGross = round(bignumber(value).div(rate), decimalPlacesEnum.decimalPlaces2).toNumber();
				entity.AmountNet = round(bignumber(entity.AmountNetOc).div(rate), decimalPlacesEnum.decimalPlaces2).toNumber();
				break;

		}
	}

	protected async recalculateDatePayment(entity: T) {
		const paymentTerm = entity.BasPaymentTermFk ?
			await firstValueFrom(this.paymentTermLookupService.getItemByKey({id: entity.BasPaymentTermFk})) :
			null;

		if (!paymentTerm) {
			return;
		}
		const dateRequest =  new Date(entity.DateRequest);
		const calculateDateResult = this.paymentTermCalculationService.calculateDate(dateRequest, paymentTerm);
		entity.DatePayment =calculateDateResult.dateNetPayable 
		? calculateDateResult.dateNetPayable.toISOString() 
		: null;
	}
}

export type AmountFieldsType = 'AmountNet' | 'AmountNetOc' | 'AmountGross' | 'AmountGrossOc';