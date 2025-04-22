/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';

/**
 * Defines additional options for string fields.
 *
 * @group Fields API
 */
export interface IAdditionalStringOptions {

	/**
	 * The maximum length of the field, if any.
	 */
	maxLength?: number;

	/**
	 * Property to add placeholder.
	 */
	placeholder?: Translatable;
}