/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {IEstLineItemQuantityEntity} from '@libs/estimate/interfaces';
import {EstimateMainLineItemQuantityDataService} from './estimate-main-line-item-quantity-data.service';
import {
    BaseValidationService,
    IValidationFunctions,
    ValidationInfo,
    ValidationResult
} from '@libs/platform/data-access';

@Injectable({
    providedIn: 'root'
})

/**
 * estimateMainLineItemQuantityValidationService provides validation methods for estimate line item quantity instances
 */
export abstract class EstimateMainLineItemQuantityValidationService extends BaseValidationService<IEstLineItemQuantityEntity> {
    protected dataService = inject(EstimateMainLineItemQuantityDataService);

    /**
     * Generates the validation functions for Estimate Main LineItem Quantity Entity
     * @returns An object containing the validation functions.
     */
    protected generateValidationFunctions(): IValidationFunctions<IEstLineItemQuantityEntity> {
        return {
            validateQuantityTypeFk: this.validateQuantityTypeFk,
            validateDate: this.validateDate,
            validateQuantity: this.validateQuantity
        };
    }

    /**
     * Validates if the code is unique and mandatory.
     * @param info Validation information for the Est LineItem Quantity entity.
     * @returns ValidationResult indicating the validation result.
     */
    protected validateQuantityTypeFk(info: ValidationInfo<IEstLineItemQuantityEntity>): ValidationResult {
        return this.validateIsMandatory(info);
    }

    /**
     * Validates if the rate is mandatory.
     * @param info Validation information for the Est LineItem Quantity entity.
     * @returns ValidationResult indicating the validation result.
     */
    protected validateDate(info: ValidationInfo<IEstLineItemQuantityEntity>): ValidationResult {
        return this.validateIsValidTimeSpanFrom(info);
    }

    /**
     * Validates if the quantity is mandatory.
     * @param info Validation information for the Est LineItem Quantity entity.
     * @returns ValidationResult indicating the validation result.
     */
    protected validateQuantity(info: ValidationInfo<IEstLineItemQuantityEntity>): ValidationResult {
        return this.validateIsMandatory(info);
    }
}