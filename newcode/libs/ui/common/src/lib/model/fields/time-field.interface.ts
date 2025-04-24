/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IField } from './field.interface';
import { FieldType } from './field-type.enum';
import { IAdditionalTimeOptions } from './additional/additional-time-options.interface';

/**
 * The definition of a field that represents a *time* input control.
 *
 * @group Fields API
 */
export interface ITimeField<T extends object> extends IField<T>, IAdditionalTimeOptions {
	/**
	 * The type of the row.
	 */
	type: FieldType.Time;
	
}
