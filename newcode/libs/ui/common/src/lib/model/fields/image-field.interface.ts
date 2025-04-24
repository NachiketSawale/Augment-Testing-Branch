/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IField} from './field.interface';
import {FieldType} from './field-type.enum';

/**
 * The definition of a field that represents a *image* input control.
 *
 * @group Fields API
 */
export interface IImageField<T extends object> extends IField<T> {

	/**
	 * The type of the row.
	 */
	type: FieldType.Image;
}
