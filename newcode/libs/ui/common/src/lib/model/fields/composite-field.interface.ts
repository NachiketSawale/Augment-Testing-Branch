/*
 * Copyright(c) RIB Software GmbH
 */

import { IField } from './field.interface';
import { FieldType } from './field-type.enum';
import { IAdditionalCompositeOptions } from './additional/additional-composite-options.interface';

/**
 * The definition of a field that represents a *composite* input control.
 *
 * @group Fields API
 */
export interface ICompositeField<T extends object> extends IField<T>, IAdditionalCompositeOptions<T> {

	/**
	 * The type of the row.
	 */
	type: FieldType.Composite;
}
