/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { INumericField } from './numeric-field.interface';
import { FieldType } from './field-type.enum';

/**
 * The definition of a field that represents a *quantity* input control.
 *
 * @group Fields API
 */
export interface IQuantityField<T extends object> extends INumericField<T> {

	/**
	 * The type of the row.
	 */
	type: FieldType.Quantity;
}
