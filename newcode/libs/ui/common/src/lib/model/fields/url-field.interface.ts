/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IField} from './field.interface';
import {FieldType} from './field-type.enum';
import { PropertyIdentifier, PropertyType } from '@libs/platform/common';

/**
 * The definition of a field that represents a *url* input control.
 *
 * @group Fields API
 */
export interface IUrlField<T extends object> extends IField<T> {

	/**
	 * The type of the row.
	 */
	type: FieldType.Url;

	/**
	 * The property that represents the data model for the field, restricted to string values.
	 */
	model?: PropertyIdentifier<T, PropertyType> & PropertyIdentifier<T, string>;
}
