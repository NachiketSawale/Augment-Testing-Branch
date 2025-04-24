/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IStringField} from './string-field.interface';
import {FieldType} from './field-type.enum';

/**
 * The definition of a field that represents a *code* input control.
 *
 * @group Fields API
 */
export interface ICodeField<T extends object> extends IStringField<T> {

	/**
	 * The type of the row.
	 */
	type: FieldType.Code;
}