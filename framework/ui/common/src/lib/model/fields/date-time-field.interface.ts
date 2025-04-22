/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IField} from './field.interface';
import {FieldType} from './field-type.enum';
import { PropertyIdentifier, PropertyType } from '@libs/platform/common';

/**
 * The definition of a field that represents a *datetime* input control.
 *
 * @group Fields API
 */
export interface IDateTimeField<T extends object> extends IField<T> {

	/**
	 * The type of the row.
	 */
	type: FieldType.DateTime;

	/**
	 * The property that represents the data model for the field, restricted to date values.
	 */
	model?: PropertyIdentifier<T, PropertyType> & PropertyIdentifier<T, Date>;
}
