/*
 * Copyright(c) RIB Software GmbH
 */

import { bignumber } from 'mathjs';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPrcCommonMainDataService } from '../../model/interfaces';
import { ProcurementCommonCalculationService } from './procurement-common-calculation.service';
import { IEntityRuntimeDataRegistry, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedCalculateOverGrossService, BasicsSharedDataValidationService } from '@libs/basics/shared';
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService } from '@libs/platform/common';

/**
 * Procurement common overallDiscount logic service
 */
@Injectable({
	providedIn: 'root'
})
export abstract class ProcurementCommonOverallDiscountService<T extends IOverallDiscountEntity> {
	private readonly http = inject(HttpClient);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly calculationService = inject(ProcurementCommonCalculationService);
	private readonly isOverGross = inject(BasicsSharedCalculateOverGrossService).isOverGross;

	private readonly overallDiscountField = 'OverallDiscount' as Partial<keyof IOverallDiscountEntity>;
	private readonly overallDiscountOcField = 'OverallDiscountOc' as Partial<keyof IOverallDiscountEntity>;
	private readonly overallDiscountFields: Partial<keyof IOverallDiscountEntity>[] = ['OverallDiscount', 'OverallDiscountOc', 'OverallDiscountPercent'];

	protected headerId2OverallValueMap: Map<string, overallValueResponse> = new Map();

	protected constructor( protected dataService: IEntityRuntimeDataRegistry<T> & IPrcCommonMainDataService<T, CompleteIdentification<T>>) {
		this.dataService.onHeaderUpdated$.subscribe(() => this.clearOverallValueCache());
		this.dataService.selectionChanged$.subscribe(() => this.clearOverallValueCache());
	}

	/**
	 * Validate OverallDiscount and OverallDiscountOc fields
	 */
	public async validateOverallDiscountFields(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity;
		const inputValue = info.value as number;
		const field = info.field as typeof this.overallDiscountField | typeof this.overallDiscountOcField;

		if (inputValue === 0) {
			this.setZeroToOverallDiscountFields(entity);
			return this.overallDiscountValidationSuccess(entity);
		}

		const overallValue = await this.getOverallValue(entity, field);
		if (inputValue > overallValue) {
			const errorKey = field === this.overallDiscountField ?
				'procurement.common.NotMoreThanNetTotalNoDiscount' :
				'procurement.common.NotMoreThanNetTotalOcNoDiscount';
			return this.validationUtils.createErrorObject({key: errorKey});
		}

		entity.OverallDiscount = field === this.overallDiscountField ? inputValue : this.calculationService.getHomeValueByOcValue(inputValue, entity.ExchangeRate);
		entity.OverallDiscountOc = field === this.overallDiscountOcField ? inputValue : this.calculationService.getOcValueByHomeValue(inputValue, entity.ExchangeRate);
		entity.OverallDiscountPercent = this.calculationService.roundTo(bignumber(inputValue).div(overallValue).mul(100), 2);
		return this.overallDiscountValidationSuccess(entity);
	}

	/**
	 * Validate OverallDiscountPercent field
	 */
	public async validateOverallDiscountPercent(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity;
		const inputPercent = info.value as number;

		if (inputPercent < 0 || inputPercent > 100) {
			return this.validationUtils.createErrorObject({key: 'procurement.common.OverallDiscountPercentRangeErr'});
		}

		if (inputPercent === 0) {
			this.setZeroToOverallDiscountFields(entity);
			return this.overallDiscountValidationSuccess(entity);
		}

		const overall = await this.getOverallValues(entity);
		entity.OverallDiscount = this.getOverallDiscountByPercent((this.isOverGross ? overall.Gross : overall.ValueNet), inputPercent);
		entity.OverallDiscountOc = this.getOverallDiscountByPercent((this.isOverGross ? overall.GrossOc : overall.ValueNetOc), inputPercent);

		return this.overallDiscountValidationSuccess(entity);
	}

	/**
	 * Update overallDiscount after exchangeRate changed
	 * @param entity
	 * @param exchangeRate
	 * @param isRemainHomeCurrency
	 */
	public updateOverallDiscountAfterExchangeRateChanged(entity: IOverallDiscountEntity, exchangeRate: number, isRemainHomeCurrency: boolean = false) {
		entity.OverallDiscount = isRemainHomeCurrency ? entity.OverallDiscount : this.calculationService.getHomeValueByOcValue(entity.OverallDiscountOc, exchangeRate);
		entity.OverallDiscountOc = isRemainHomeCurrency ? this.calculationService.getOcValueByHomeValue(entity.OverallDiscount, exchangeRate) : entity.OverallDiscountOc;
	}

	private getOverallDiscountByPercent(overallValue: number, percent: number) {
		return this.calculationService.roundTo(bignumber(overallValue).mul(percent).div(100), 2);
	}

	private setZeroToOverallDiscountFields(entity: T) {
		entity.OverallDiscount = 0;
		entity.OverallDiscountOc = 0;
		entity.OverallDiscountPercent = 0;
	}

	private overallDiscountValidationSuccess(entity: T): ValidationResult {
		const result = this.validationUtils.createSuccessObject();
		this.overallDiscountFields.forEach(f => {
			this.dataService.removeInvalid(entity, {field: f, result: result});
		});
		return result;
	}

	private async getOverallValue(entity: T, field: typeof this.overallDiscountField | typeof this.overallDiscountOcField): Promise<number> {
		const overallValues = await this.getOverallValues(entity);
		return (field === this.overallDiscountField) ?
			(this.isOverGross ? overallValues.Gross : overallValues.ValueNet) :
			(this.isOverGross ? overallValues.GrossOc : overallValues.ValueNetOc);
	}

	private async getOverallValues(entity: T): Promise<overallValueResponse> {
		return this.getOverallValueRequest(entity.Id);
	}

	private async getOverallValueRequest(headerId: number): Promise<overallValueResponse> {
		const key = `${headerId}.overallValue`;
		const overallValueCache = this.headerId2OverallValueMap.get(key);
		if (overallValueCache) {
			return overallValueCache;
		}

		const url = this.configurationService.webApiBaseUrl + 'procurement/common/overallDiscount/getOverallValue';
		const overallValue = await firstValueFrom(this.http.post<overallValueResponse>(url, {PrcHeaderFks: this.getPrcHeaderFks()}));
		this.headerId2OverallValueMap.set(key, overallValue);
		return overallValue;
	}

	protected getPrcHeaderFks(): number[] {
		return [];
	}

	private clearOverallValueCache() {
		this.headerId2OverallValueMap.clear();
	}
}

/**
 * Overall Discount entity
 */
interface IOverallDiscountEntity extends IEntityIdentification {
	ExchangeRate: number;
	OverallDiscount: number;
	OverallDiscountOc: number;
	OverallDiscountPercent: number;
}

/**
 * Get overall value request response
 */
type overallValueResponse = {
	ValueNetOc: number;
	ValueNet: number;
	GrossOc: number;
	Gross: number;
}