/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { INumericField } from './numeric-field.interface';
import { FieldType } from './field-type.enum';

/**
 * The definition of a field that represents a *linearquantity* input control.
 *
 * @group Fields API
 */
export interface ILinearQuantityField<T extends object> extends INumericField<T> {

	/**
	 * The type of the row.
	 */
	type: FieldType.LinearQuantity;
}
