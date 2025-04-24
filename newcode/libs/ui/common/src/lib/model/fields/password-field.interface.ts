/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {FieldType} from './field-type.enum';
import {IStringField} from './string-field.interface';
import { PropertyIdentifier, PropertyType } from '@libs/platform/common';

/**
 * The definition of a field that represents a *password* input control.
 *
 * @group Fields API
 */
export interface IPasswordField<T extends object> extends IStringField<T> {

	/**
	 * The type of the row.
	 */
	type: FieldType.Password;

	/**
	 * The property that represents the data model for the field, restricted to string values.
	 */
	model?: PropertyIdentifier<T, PropertyType> & PropertyIdentifier<T, string>;
}
