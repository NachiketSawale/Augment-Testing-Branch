/*
 * Copyright(c) RIB Software GmbH
 */

import { PropertyType } from '@libs/platform/common';

/**
 * Provides information about a value to validate.
 *
 * @typeParam T The entity type whose properties are validated.
 */
export class FieldValidationInfo<T> {

	/**
	 * Initializes a new instance.
	 *
	 * @param entity Ghe entity to validate.
	 * @param value The value of the field for validation.
	 */
	public constructor(public readonly entity: T, public readonly value: PropertyType | undefined) {

	}
}
