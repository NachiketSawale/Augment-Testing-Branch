/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { INumericField } from './numeric-field.interface';
import { FieldType } from './field-type.enum';

/**
 * The definition of a field that represents a *imperialft* input control.
 *
 * @group Fields API
 */
export interface IImperialFtField<T extends object> extends INumericField<T> {

	/**
	 * The type of the row.
	 */
	type: FieldType.ImperialFt;
}
