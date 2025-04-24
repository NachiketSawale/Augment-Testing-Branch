/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IField} from './field.interface';
import {FieldType} from './field-type.enum';
import {IFixedSelectOptions} from './additional/fixed-select-options.interface';
import {IServiceSelectOptions} from './additional/service-select-options.interface';
import {IInputSelectOptions} from './additional/input-select-options.interface';

/**
 * The definition of a field that represents a *inputselect* input control.
 * WARNING: This type is work in progress and will probably change.
 *
 * @group Fields API
 */
export interface IInputSelectField<T extends object> extends IField<T> {

	/**
	 * Contains options for the *select* control.
	 */
	options: (IFixedSelectOptions | IServiceSelectOptions) & IInputSelectOptions;

	/**
	 * The type of the row.
	 */
	type: FieldType.InputSelect;
}
