/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { PropertyType } from '@libs/platform/common';

export class ValidationInfo<T> {

	/**
	 *
	 * @param entity the entity to validate
	 * @param value the value of the field for validation
	 * @param field the name of the field where the value is applied when valid
	 */
	public constructor(public readonly entity: T, public readonly value: PropertyType | undefined, public readonly field: string) {

	}
}