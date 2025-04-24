/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IField } from './field.interface';
import { FieldType } from './field-type.enum';
import { IAdditionalColorOptions } from './additional/additional-color-options.interface';

/**
 * The definition of a field that represents a *color* input control.
 *
 * @group Fields API
 */
export interface IColorField<T extends object> extends IField<T>, IAdditionalColorOptions {

	/**
	 * The type of the row.
	 */
	type: FieldType.Color;
}
