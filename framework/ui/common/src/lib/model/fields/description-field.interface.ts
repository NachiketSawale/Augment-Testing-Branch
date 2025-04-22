/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {FieldType} from './field-type.enum';
import {IStringField} from './string-field.interface';

/**
 * The definition of a field that represents a *description* input control.
 *
 * @group Fields API
 */
export interface IDescriptionField<T extends object> extends IStringField<T> {

	/**
	 * The type of the row.
	 */
	type: FieldType.Description;
}
