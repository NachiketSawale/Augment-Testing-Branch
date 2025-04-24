/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';

/**
 * Defines additional options for numeric fields.
 *
 * @group Fields API
 */
export interface IAdditionalNumericOptions {

	/**
	 * The maximum allowable number.
	 */
	minValue?: number;

	/**
	 * The minimum allowable number.
	 */
	maxValue?: number;

	/**
	 * The placeholder of the field.
	 */
	placeholder?: Translatable;
}