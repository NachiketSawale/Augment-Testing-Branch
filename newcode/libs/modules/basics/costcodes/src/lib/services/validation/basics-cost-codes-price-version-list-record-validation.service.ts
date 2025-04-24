/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IValidationFunctions, IEntityRuntimeDataRegistry, ValidationInfo, ValidationResult, BaseValidationService } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsCostCodesPriceVersionListRecordDataService } from '../data-service/basics-cost-codes-price-version-list-record-data.service';
import { ICostcodePriceListEntity } from '@libs/basics/interfaces';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class BasicsCostcodesPriceVersionListRecordValidationService extends BaseValidationService<ICostcodePriceListEntity> {
	private dataService = inject(BasicsCostCodesPriceVersionListRecordDataService);
	private validationService = inject(BasicsSharedDataValidationService);
	private readonly httpService = inject(PlatformHttpService);
	private configurationService = inject(PlatformConfigurationService);
	protected translate = inject(PlatformTranslateService);
	protected generateValidationFunctions(): IValidationFunctions<ICostcodePriceListEntity> {
		return {
			CostcodePriceVerFk: this.asyncValidateCostcodePriceVerFk,
			FactorCost: this.asyncValidateFactorCost,
			FactorQuantity: this.asyncValidateFactorQuantity,
		};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICostcodePriceListEntity> {
		return this.dataService;
	}

	public getParent(entity: ICostcodePriceListEntity) {
		const endPointURL = 'basics/material/generatecodeontemptypechanged';
		return this.httpService.post<ICostcodePriceListEntity>(endPointURL, entity);
	}
	public validateRate(info: ValidationInfo<ICostcodePriceListEntity>) {
		const validateResult = this.validationService.isUniqueAndMandatory(info, this.dataService.getList());

		if (validateResult) {
			// 	let priceVersion = _.find(basicsLookupdataLookupDescriptorService.getData('CostCodePriceVersion'), {Id: value});     // TODO: Dependancy is basicsLookupdataLookupDescriptorService
			// 					if (priceVersion) {
			// 						entity.CurrencyFk = priceVersion.PriceListCurrencyFk;
			// 					}
			//   }
		}
		return validateResult;
	}

	/**
 * @brief Asynchronously validates the foreign key of the `CostcodePriceListEntity` and updates related properties

 * @param info A `ValidationInfo` object containing the data for the `ICostcodePriceListEntity` that needs validation.
 
 * @return A `Promise` that resolves to a `ValidationResult` indicating whether the validation was successful.
 */
	public async asyncValidateCostcodePriceVerFk(info: ValidationInfo<ICostcodePriceListEntity>): Promise<ValidationResult> {
		const result = new ValidationResult();
		const entity = info.entity;
		await this.getParent(entity).then((response) => {
			if (response && entity) {
				entity.RealFactorCost = response.RealFactorCost ? response.RealFactorCost * entity.FactorCost! : entity.FactorCost;
				entity.RealFactorQuantity = response.RealFactorQuantity ? response.RealFactorQuantity * entity.FactorQuantity! : entity.FactorQuantity;
			}
			const finalresult = this.validationService.isUniqueAndMandatory(info, this.dataService.getList());
			return finalresult;
		});

		return result;
	}

	/**
	 * @brief Validates the entity by performing asynchronous validation on its foreign key.
	 * @param info A `ValidationInfo` object containing the data for the entity of type `ICostcodePriceListEntity`.
	 */
	public validateEntity(info: ValidationInfo<ICostcodePriceListEntity>) {
		this.asyncValidateCostcodePriceVerFk(info);
	}

	/**
	 * @brief Registers the creation of an entity and validates it.
	 * @param info A `ValidationInfo` object containing the data for the created entity of type `ICostcodePriceListEntity`.
	 */
	public registerEntityCreated(info: ValidationInfo<ICostcodePriceListEntity>) {
		this.validateEntity(info);
	}

	/**
 * @brief Asynchronously validates the `FactorCost` field for the `ICostcodePriceListEntity`.
 * @param info A `ValidationInfo` object containing the `FactorCost` data for `ICostcodePriceListEntity`.

 * @return A `Promise` that resolves to a `ValidationResult` indicating whether the `FactorCost` field 
 *         is valid and, if not, provides an appropriate error message.
 */
	public async asyncValidateFactorCost(info: ValidationInfo<ICostcodePriceListEntity>): Promise<ValidationResult> {
		const value = info.value as number;
		let result = new ValidationResult();
		const entity = info.entity;
		const validRes = this.validationService.isMandatory(info);

		if (validRes && value) {
			entity.RealFactorCost = value;
			result = await this.getParent(entity).then((response) => {
				if (response) {
					entity.RealFactorCost = response.RealFactorCost ? response.RealFactorCost * value : value;
				}
				return this.validationService.isUniqueAndMandatory(info, this.dataService.getList());
			});
		} else {
			result.valid = false;
			result.error = this.translate.instant('cloud.common.greaterValueErrorMessage').text;
		}
		return result;
	}

	/**
	 * @brief Asynchronously validates the `FactorQuantity` field for the `ICostcodePriceListEntity`.
	 * @param info A `ValidationInfo` object containing the `FactorQuantity` data for `ICostcodePriceListEntity`.
	 * @return A `Promise` that resolves to a `ValidationResult` indicating whether the `FactorQuantity` field
	 *         is valid and, if not, provides an appropriate error message.
	 */
	public async asyncValidateFactorQuantity(info: ValidationInfo<ICostcodePriceListEntity>): Promise<ValidationResult> {
		const value = info.value as number;
		let result = new ValidationResult();
		const entity = info.entity;
		const validRes = this.validationService.isUniqueAndMandatory(info, this.dataService.getList());

		if (!validRes && value) {
			result = await this.getParent(entity).then((response) => {
				if (response) {
					entity.RealFactorQuantity = response.RealFactorQuantity ? response.RealFactorQuantity * value : value;
				}
				return this.validationService.isMandatory(info);
			});
		} else {
			result.valid = false;
			result.error = this.translate.instant('cloud.common.greaterValueErrorMessage').text;
		}

		return result;
	}

	/**
	 * @brief Validates the `FactorHour` field for the `ICostcodePriceListEntity`.
	 * @param info A `ValidationInfo` object containing the `FactorHour` data for `ICostcodePriceListEntity`.
	 * @return A `ValidationResult` indicating whether the `FactorHour` field is valid and, if not, an appropriate error message.
	 */

	public validateFactorHour(info: ValidationInfo<ICostcodePriceListEntity>) {
		let result = this.validationService.isUniqueAndMandatory(info, this.dataService.getList());

		if (result) {
			return result;
		} else {
			result = new ValidationResult();
			result.valid = false;
			result.error = this.translate.instant('cloud.common.greaterValueErrorMessage').text;
		}

		return result;
	}
}
