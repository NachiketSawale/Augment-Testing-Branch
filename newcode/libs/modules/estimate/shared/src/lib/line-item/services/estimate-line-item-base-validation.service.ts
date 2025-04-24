/*
 * Copyright(c) RIB Software GmbH
 */

import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { inject } from '@angular/core';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { merge, repeat } from 'lodash';
import { EstimateMainDetailValidationService } from '../../common/services/estimate-main-detail-validation.service';
import { zonedTimeToUtc } from 'date-fns-tz';

/**
 * Estimate Line Item Base Validation Service
 */
export abstract class EstimateLineItemBaseValidationService extends BaseValidationService<IEstLineItemEntity>{
	protected translateService = inject(PlatformTranslateService);
	protected http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);
	protected estimateMainDetailValidationService = inject(EstimateMainDetailValidationService);

	protected abstract generateCustomizeValidationFunctions():IValidationFunctions<IEstLineItemEntity>|null;

	/**
	 * Constructor
	 * @param dataService
	 * @protected
	 */
	protected constructor(protected dataService:IEntityRuntimeDataRegistry<IEstLineItemEntity>) {
		super();
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEstLineItemEntity> {
		return this.dataService;
	}

	protected generateValidationFunctions():IValidationFunctions<IEstLineItemEntity>{
		//TODO:<EstimateMainService> missing
		const customizeValidationFunctions = this.generateCustomizeValidationFunctions();
		if(!customizeValidationFunctions){
			return this.getCommonValidationFunctions();
		}
		return merge(this.getCommonValidationFunctions(), customizeValidationFunctions);
	}

	protected getCommonValidationFunctions(): IValidationFunctions<IEstLineItemEntity> {
		return {
			Code: this.asyncValidateCode,
			FromDate: [this.validateFromDate, this.validateDate],
			ToData: [this.validateToDate,this.validateDate],
			QuantityDetail: this.validateDetail,
			QuantityTargetDetail: this.validateDetail,
			WqQuantityTargetDetail: this.validateDetail,
			QuantityFactorDetail1: this.validateDetail,
			QuantityFactorDetail2: this.validateDetail,
			ProductivityFactorDetail: this.validateDetail,
			CostFactorDetail1: this.validateDetail,
			CostFactorDetail2: this.validateDetail,
			SortCode01Fk: this.validateSortCodeFk,
			SortCode02Fk: this.validateSortCodeFk,
			SortCode03Fk: this.validateSortCodeFk,
			SortCode04Fk: this.validateSortCodeFk,
			SortCode05Fk: this.validateSortCodeFk,
			SortCode06Fk: this.validateSortCodeFk,
			SortCode07Fk: this.validateSortCodeFk,
			SortCode08Fk: this.validateSortCodeFk,
			SortCode09Fk: this.validateSortCodeFk,
			SortCode10Fk: this.validateSortCodeFk,
			SortDesc01Fk: this.validateSortDescFk,
			SortDesc02Fk: this.validateSortDescFk,
			SortDesc03Fk: this.validateSortDescFk,
			SortDesc04Fk: this.validateSortDescFk,
			SortDesc05Fk: this.validateSortDescFk,
			SortDesc06Fk: this.validateSortDescFk,
			SortDesc07Fk: this.validateSortDescFk,
			SortDesc08Fk: this.validateSortDescFk,
			SortDesc09Fk: this.validateSortDescFk,
			SortDesc10Fk: this.validateSortDescFk,
		};
	}

	private checkCode(code: string) {
		// example: '33'  --->  '000033'
		const maxLength = 6;
		return repeat('0', maxLength - code.length) + code;
	}

	/**
	 * Validate if the code is mandatory
	 * @param info
	 */
	public asyncValidateCode(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult> {

		const postData = {Id: info.entity.Id, estHeaderFk: info.entity.EstHeaderFk, Code: info.value};// Call data prepared

		return new Promise((resolve) => {
			const entity = info.entity;
			const value = info.value as string;
			let result = this.validateIsMandatory(info);
			if (!result.valid) {
				resolve(result);
			} else {
				result = this.validateIsUnique(info);
				if (!result.valid) {
					resolve(result);
				} else {
					entity.Code = value;
					this.http.post(this.configurationService.webApiBaseUrl + 'estimate/main/lineitem/isuniquecode', postData)
						.subscribe(response => {
							const isUnique = response as boolean;
							if (isUnique) {
								resolve({apply: true, valid: true});
							} else {
								resolve({
									apply: false,
									valid: false,
									error: this.translateService.instant('basics.costgroups.uniqCode').text
								});
							}
						});
				}
			}
		});
	}

	/**
	 * FromDate validate
	 * @param info
	 */
	public validateFromDate(info: ValidationInfo<IEstLineItemEntity>) {
		const fromDate = zonedTimeToUtc(info.value as Date, 'UTC'); //moment.isMoment(info.value) ? value : moment.utc(value);
		const toDate = info.entity.ToDate ? zonedTimeToUtc(info.entity.ToDate, 'UTC') : info.entity.ToDate; //moment.isMoment(entity.ToDate) ? entity.ToDate : moment.utc(entity.ToDate);

		if (!fromDate) {
			return {apply: false, valid: false};
		}

		if (!toDate) {
			return {apply: true, valid: true};
		}

		if (toDate < fromDate) {
			return {
				apply: false,
				valid: false,
				error: this.translateService.instant('cloud.common.Error_EndDateTooEarlier').text
			};
		} else {
			return {apply: true, valid: true};
		}
	}

	/**
	 * ToDate validate
	 * @param info
	 */
	public validateToDate(info: ValidationInfo<IEstLineItemEntity>) {
		const fromDate = info.entity.FromDate ? zonedTimeToUtc(info.entity.FromDate, 'UTC') : info.entity.FromDate; //moment.isMoment(info.value) ? value : moment.utc(value);
		const toDate = zonedTimeToUtc(info.value as Date, 'UTC');  //moment.isMoment(entity.ToDate) ? entity.ToDate : moment.utc(entity.ToDate);

		if (!toDate) {
			return {apply: false, valid: false};
		}

		if (!fromDate) {
			return {apply: true, valid: true};
		}

		if (toDate < fromDate) {
			return {
				apply: false,
				valid: false,
				error: this.translateService.instant('cloud.common.Error_EndDateTooEarlier').text
			};
		} else {
			return {apply: true, valid: true};
		}
	}

	private validateDate(info: ValidationInfo<IEstLineItemEntity>){
		//TODO: waiting for estimateMainDurationCalculatorService
		// if (info.entity && info.entity.Id && info.entity.BasUomFk) {
		// 	const itemQty = info.entity.Quantity;
		// 	return estimateMainDurationCalculatorService.getDuration(info.entity).then((result) => {
		// 		if (result > 0 && result !== itemQty) {
		// 			item.Quantity = result;
		// 			item.QuantityDetail = result.toString();
		// 			calcLineItemResNDynamicCol(field, item, resourceList);
		// 		}
		// 	});
		// }
		return {apply: true, valid: true};
	}

	/**
	 * Validate detail
	 * @param info
	 */
	public validateDetail(info: ValidationInfo<IEstLineItemEntity>){
		return this.estimateMainDetailValidationService.mapCultureValidation(info);
	}

	/**
	 * Validate SortCodeFk
	 * @param info
	 */
	public validateSortCodeFk(info: ValidationInfo<IEstLineItemEntity>) {
		const entity = info.entity;
		const value = info.value as number|null;
		switch (info.field){
			case 'SortCode01Fk':
				entity.SortDesc01Fk = value;
				break;
			case 'SortCode02Fk':
				entity.SortDesc02Fk = value;
				break;
			case 'SortCode03Fk':
				entity.SortDesc03Fk = value;
				break;
			case 'SortCode04Fk':
				entity.SortDesc04Fk = value;
				break;
			case 'SortCode05Fk':
				entity.SortDesc05Fk = value;
				break;
			case 'SortCode06Fk':
				entity.SortDesc06Fk = value;
				break;
			case 'SortCode07Fk':
				entity.SortDesc07Fk = value;
				break;
			case 'SortCode08Fk':
				entity.SortDesc08Fk = value;
				break;
			case 'SortCode09Fk':
				entity.SortDesc09Fk = value;
				break;
			case 'SortCode10Fk':
				entity.SortDesc10Fk = value;
				break;
		}

		return {valid: true};
	}

	/**
	 * Validate SortDescFk
	 * @param info
	 * @private
	 */
	public validateSortDescFk(info: ValidationInfo<IEstLineItemEntity>) {
		const entity = info.entity;
		const value = info.value as number|null;
		switch (info.field) {
			case 'SortDesc01Fk':
				entity.SortCode01Fk = value;
				break;
			case 'SortDesc02Fk':
				entity.SortCode02Fk = value;
				break;
			case 'SortDesc03Fk':
				entity.SortCode03Fk = value;
				break;
			case 'SortDesc04Fk':
				entity.SortCode04Fk = value;
				break;
			case 'SortDesc05Fk':
				entity.SortCode05Fk = value;
				break;
			case 'SortDesc06Fk':
				entity.SortCode06Fk = value;
				break;
			case 'SortDesc07Fk':
				entity.SortCode07Fk = value;
				break;
			case 'SortDesc08Fk':
				entity.SortCode08Fk = value;
				break;
			case 'SortDesc09Fk':
				entity.SortCode09Fk = value;
				break;
			case 'SortDesc10Fk':
				entity.SortCode10Fk = value;
				break;
		}
		return {valid: true};
	}
}