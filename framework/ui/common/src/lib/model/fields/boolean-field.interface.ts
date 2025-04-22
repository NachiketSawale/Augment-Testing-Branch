/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IField} from './field.interface';
import {FieldType} from './field-type.enum';
import { PropertyIdentifier, PropertyType } from '@libs/platform/common';

/**
 * The definition of a field that represents a *boolean* input control.
 *
 * @group Fields API
 */
export interface IBooleanField<T extends object> extends IField<T> {

	/**
	 * The type of the row.
	 */
	type: FieldType.Boolean;

	/**
	 * The property that represents the data model for the field, restricted to boolean values.
	 */
	model?: PropertyIdentifier<T, PropertyType> & PropertyIdentifier<T, boolean>;
}
