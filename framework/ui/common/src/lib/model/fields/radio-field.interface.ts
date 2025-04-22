/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IField } from './field.interface';
import { FieldType } from './field-type.enum';
import { PropertyType } from '@libs/platform/common';
import { IAdditionalSelectOptions } from './additional/additional-select-options.interface';

/**
 * The definition of a field that represents a *radio* input control.
 *
 * @group Fields API
 */
export interface IRadioField<T extends object> extends IField<T>, IAdditionalSelectOptions<PropertyType> {

	/**
	 * The type of the row.
	 */
	type: FieldType.Radio;
}
