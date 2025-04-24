/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {FieldType} from './field-type.enum';
import {IStringField} from './string-field.interface';

/**
 * The definition of a field that represents a *remark* input control.
 *
 * @group Fields API
 */
export interface IRemarkField<T extends object> extends IStringField<T> {

	/**
	 * The type of the row.
	 */
	type: FieldType.Remark;
}
