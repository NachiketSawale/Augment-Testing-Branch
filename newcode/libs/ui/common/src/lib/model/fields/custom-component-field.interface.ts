/*
 * Copyright(c) RIB Software GmbH
 */

import {IField} from './field.interface';
import {FieldType} from './field-type.enum';
import {
	IAdditionalCustomComponentOptions
} from './additional/additional-custom-component-options.interface';

/**
 * The definition of a field that represents a *select* control.
 *
 * @group Fields API
 */
export interface ICustomComponentField<T extends object> extends IField<T>, IAdditionalCustomComponentOptions {

	/**
	 * The type of the row.
	 */
	type: FieldType.CustomComponent;
}