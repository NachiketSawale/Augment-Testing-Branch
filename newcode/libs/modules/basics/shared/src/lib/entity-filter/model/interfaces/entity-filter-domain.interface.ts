/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType } from '@libs/ui/common';
import { IEntityFilterDomainOption } from './entity-filter-domain-option.interface';
import { InjectionToken } from '@angular/core';
import { Translatable } from '@libs/platform/common';

/**
 * Interface representing an entity filter domain.
 * @template TFactor - The type of the elements being compared.
 */
export interface IEntityFilterDomain<TFactor> {
	/**
	 * The domain field type of the domain option.
	 */
	type: FieldType;

	/**
	 * The list of domain options.
	 */
	options: IEntityFilterDomainOption[];

	/**
	 * Optional comparer function to compare two elements of type T.
	 * @param {TFactor} a - The first element to compare.
	 * @param {TFactor} b - The second element to compare.
	 * @returns {number} The comparison result.
	 */
	comparer?: (a: TFactor, b: TFactor) => number;

	/**
	 * Optional object containing error messages for range validation.
	 */
	rangeErrors?: {
		/**
		 * Error message for when the value is below the minimum allowed.
		 */
		min: Translatable;

		/**
		 * Error message for when the value exceeds the maximum allowed.
		 */
		max: Translatable;

		/**
		 * Error message for when the values are identical.
		 */
		identical: Translatable;
	};
}

/**
 * Injection token for the entity filter domain.
 */
export const ENTITY_FILTER_DOMAIN = new InjectionToken<IEntityFilterDomain<unknown>>('ENTITY_FILTER_DOMAIN');
