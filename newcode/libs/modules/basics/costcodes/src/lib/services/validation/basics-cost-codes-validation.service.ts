/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ICostCodeEntity } from '../../model/models';
import { BasicsCostCodesDataService } from '../data-service/basics-cost-codes-data.service';
import { BasicsCostcodesHourfactorReadonlyProcessorService } from '../processor/basics-cost-codes-hourfactor-readonly-processor.service';

/**
 * Basics Cost Codes Validation Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCostcodesValidationService extends BaseValidationService<ICostCodeEntity> {
	protected hourfactorReadonlyProcessor = inject(BasicsCostcodesHourfactorReadonlyProcessorService);
	protected DataService: BasicsCostCodesDataService = inject(BasicsCostCodesDataService);
	protected generateValidationFunctions(): IValidationFunctions<ICostCodeEntity> {
		return {
			Code: this.validateCode,
			Rate: this.validateRate,
			FactorCosts: this.validateFactorCosts,
			FactorQuantity: this.validateFactorQuantity
		};
	}
	/**
	 * @brief Retrieves the runtime data registry for `ICostCodeEntity`.
	 * This method returns the `DataService` that acts as the runtime data registry
	 * for entities of type `ICostCodeEntity`.
	 * @return A reference to the `IEntityRuntimeDataRegistry` of `ICostCodeEntity`.
	 */
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICostCodeEntity> {
		return this.DataService;
	}

	/**
	 * @brief Validates the provided code for the `ICostCodeEntity`.
	 * This method validates whether the given `Code` is mandatory by calling the
	 * `validateIsMandatory` method.
	 * @param Code A `ValidationInfo` object containing the code data for `ICostCodeEntity`.
	 * @return A `ValidationResult` indicating the result of the validation.
	 */
	protected validateCode(Code: ValidationInfo<ICostCodeEntity>): ValidationResult {
		return this.validateIsMandatory(Code);
	}

	/**
	 * @brief Validates the provided rate for the `ICostCodeEntity`.
	 * This method checks if the provided `Rate` is mandatory by calling the
	 * `validateIsMandatory` method.
	 * @param Rate A `ValidationInfo` object containing the rate data for `ICostCodeEntity`.
	 * @return A `ValidationResult` indicating the outcome of the validation process.
	 */
	protected validateRate(Rate: ValidationInfo<ICostCodeEntity>): ValidationResult {
		return this.validateIsMandatory(Rate);
	}

	/**
	 * @brief Validates the `FactorCosts` for the `ICostCodeEntity`.
	 * This method sets the `RealFactorCosts` property of the provided entity to the value
	 * specified in the `ValidationInfo` object. It then checks if the `info` is mandatory
	 * by calling the `validateIsMandatory` method.
	 * @param info A `ValidationInfo` object containing the `FactorCosts` data for `ICostCodeEntity`.
	 *
	 * @return A `ValidationResult` indicating the outcome of the validation process.
	 */
	protected validateFactorCosts(info: ValidationInfo<ICostCodeEntity>): ValidationResult {
		const value = info.value as number;
		info.entity.RealFactorCosts = value;

		return this.validateIsMandatory(info);
	}

	/**
	 * @brief Validates the `FactorQuantity` for the `ICostCodeEntity`.
	 * This method checks if the provided `FactorQuantity` is mandatory by calling the
	 * `validateIsMandatory` method.
	 * @param FactorQuantity A `ValidationInfo` object containing the factor quantity data for `ICostCodeEntity`.
	 * @return A `ValidationResult` indicating the outcome of the validation process.
	 */
	protected validateFactorQuantity(FactorQuantity: ValidationInfo<ICostCodeEntity>): ValidationResult {
		return this.validateIsMandatory(FactorQuantity);
	}


/**
 * @brief Validates the `IsLabour` field for the `ICostCodeEntity`.
 * This method sets the `hourfactorReadonly` status of the entity using the 
 * `hourfactorReadonlyProcessor`, processes the entity's editable state, and adjusts 
 * the `FactorHour` property if `IsLabour` is not set. It then validates whether 
 * the `IsLabour` field is mandatory.
 * @param IsLabour A `ValidationInfo` object containing the labour-related data for `ICostCodeEntity`.
 * @return A `ValidationResult` indicating the outcome of the validation process.
 */
	protected validateIsLabour(IsLabour: ValidationInfo<ICostCodeEntity>): ValidationResult {
		this.hourfactorReadonlyProcessor.setHourfactorReadonly(IsLabour.entity, true);
		this.hourfactorReadonlyProcessor.processIsEditable();
		if (!IsLabour.value) {
			IsLabour.entity.FactorHour = 1;
		}
		return this.validateIsMandatory(IsLabour);
	}

	// public validateChildren(FactorCosts: ValidationInfo<ICostCodeEntity>): ValidationResult {
	// 	// let cloudCommonGridService = $injector.get('cloudCommonGridService');
	// 	// let children = cloudCommonGridService.getAllChildren(entity, 'CostCodes');
	// 	// angular.forEach(children, function(ch){                                                            // TODO cloudCommonGridService  dependancy
	// 	//   if(ch){
	// 	//     ch[model] = value;
	// 	//     basicsCostCodesMainService.markItemAsModified(ch);
	// 	//   }
	// 	// });
	// 	//  return !platformDataValidationService.isEmptyProp(value, model);
	// 	//return;
	// }
}
