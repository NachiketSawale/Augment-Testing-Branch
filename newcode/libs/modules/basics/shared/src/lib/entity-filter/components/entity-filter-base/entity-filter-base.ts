/*
 * Copyright(c) RIB Software GmbH
 */

import { cloneDeep } from 'lodash';
import { inject } from '@angular/core';
import { ActivePopup, FieldType } from '@libs/ui/common';
import { ENTITY_FILTER_DEFINITION, EntityFilterOperator, EntityFilterScope, IEntityFilterDefinition } from '../../model';
import { IEntityIdentification, Translatable } from '@libs/platform/common';

/**
 * Base class for entity filter components.
 * Provides functionality to manage filter definitions and cache filter factors.
 */
export class BasicsSharedEntityFilterBase<TFactor, TEntity extends IEntityIdentification> {
	/**
	 * Constant holding the field type values.
	 * @protected
	 */
	protected readonly FieldType = FieldType;
	/**
	 * Constant holding the filter operator values.
	 */
	protected readonly EntityFilterOperator = EntityFilterOperator;

	/**
	 * Instance of ActivePopup used to manage popup dialogs.
	 */
	protected readonly popup = inject(ActivePopup);

	/**
	 * Original filter definition injected from the model.
	 */
	protected readonly originalDef = inject(ENTITY_FILTER_DEFINITION);

	/**
	 * Instance of the EntityFilterScope service.
	 * @protected
	 */
	protected readonly scope = inject(EntityFilterScope<TEntity>);

	/**
	 * Deep clone of the original filter definition to allow modifications.
	 */
	protected readonly definition: IEntityFilterDefinition = cloneDeep({
		...this.originalDef,
		// ignore the list and predefined list for possible performance issue
		List: [],
		PredefinedList: [],
	});

	/**
	 * Cache for filter factors based on the operator.
	 */
	protected readonly factorsCache = new Map<EntityFilterOperator, unknown[]>();

	/**
	 * Array of validation errors for the filter factors.
	 * @protected
	 */
	protected validationErrors: (Translatable | null | undefined)[] = [];

	/**
	 * Gets the validation error for the range factors.
	 * @returns The validation error for the first or second factor, if any.
	 */
	protected get rangeError() {
		return this.validationErrors[0] || this.validationErrors[1];
	}

	/**
	 * Lifecycle hook that is called after data-bound properties are initialized.
	 * Caches the factors using the operator as the key if the definition has an Operator and Factors.
	 */
	protected initialize() {
		if (!this.definition.Factors) {
			this.definition.Factors = [];
		}

		if (this.definition.Operator) {
			this.factorsCache.set(this.definition.Operator, this.definition.Factors);
		}
	}

	/**
	 * Checks if the required factors are filled based on the operator.
	 * For the Range operator, both factors must be non-null.
	 * For other operators, only the first factor must be non-null.
	 * @returns {boolean} True if the required factors are filled, false otherwise.
	 * @protected
	 */
	protected checkRequiredFactors(): boolean {
		if (this.definition.Operator === this.EntityFilterOperator.Range) {
			return this.getFactor(0) != null && this.getFactor(1) != null;
		}

		return this.getFactor(0) != null;
	}

	/**
	 * Determines if the apply action can be performed.
	 * Checks for validation errors and required factors.
	 * @returns {boolean} True if the apply action can be performed, false otherwise.
	 */
	protected canApply(): boolean {
		if (this.hasValidationError()) {
			return false;
		}

		return this.checkRequiredFactors();
	}

	/**
	 * Closes the popup and passes the current definition back to the caller.
	 * Sets the isOk flag to true to indicate a successful operation.
	 */
	protected apply() {
		this.popup.close({
			apply: true,
			value: this.definition,
		});
	}

	/**
	 * Updates the Operator in the definition and retrieves the corresponding factors from the cache.
	 * Initializes an empty array if no factors are found and updates the cache with the new factors.
	 */
	protected changeOperator() {
		this.definition.Operator = Number(this.definition.Operator);
		this.definition.Factors = this.factorsCache.get(this.definition.Operator) ?? [];
		this.factorsCache.set(this.definition.Operator, this.definition.Factors);
		this.clearValidationErrors();
		this.definition.Factors.forEach((e, index) => this.updateValidationError(index, e as TFactor));
	}

	/**
	 * Retrieves the factor at the specified index from the definition.
	 * @param index
	 * @protected
	 */
	protected getFactor(index: number): TFactor {
		if (!this.definition.Factors) {
			this.definition.Factors = [];
		}
		return this.definition.Factors[index] as TFactor;
	}

	/**
	 * Sets the factor at the specified index in the definition.
	 * @param index
	 * @param value
	 * @protected
	 */
	protected setFactor(index: number, value: TFactor): void {
		if (!this.definition.Factors) {
			this.definition.Factors = [];
		}
		this.definition.Factors[index] = value;
		this.updateValidationError(index, value);
	}

	/**
	 * Updates validation error of factor according to index.
	 * @param index
	 * @param value
	 * @protected
	 */
	protected updateValidationError(index: number, value: TFactor) {
		this.validationErrors[index] = this.validate(index, value);
	}

	/**
	 * Updates validation error of factor according to index.
	 * @param index
	 * @param error
	 * @protected
	 */
	protected validate(index: number, value: TFactor): Translatable | null | undefined {
		let error: Translatable | null | undefined = null;

		if (this.definition.Operator === this.EntityFilterOperator.Range) {
			this.clearValidationErrors();

			if (index === 0) {
				error = this.validateRange(value, this.getFactor(1), 0);
			} else {
				error = this.validateRange(this.getFactor(0), value, 1);
			}
		}
		return error;
	}

	/**
	 * Validates the range between the start and end values.
	 * @template T - The type of the start and end values.
	 * @param {T} start - The start value of the range.
	 * @param {T} end - The end value of the range.
	 * @param {number} index - The index of the factor being validated.
	 * @returns {Translatable | null | undefined} The validation error message, or null/undefined if no error.
	 * @protected
	 */
	protected validateRange(start: TFactor, end: TFactor, index: number): Translatable | null | undefined {
		return;
	}

	/**
	 * Checks if validation error exists
	 * @protected
	 */
	protected hasValidationError() {
		return this.validationErrors.some((e) => e != null);
	}

	/**
	 * Clears all validation errors.
	 * @protected
	 */
	protected clearValidationErrors() {
		this.validationErrors.length = 0;
	}
}
