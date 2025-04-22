/*
 * Copyright(c) RIB Software GmbH
 */

import { IField } from './field.interface';
import { FieldType } from './field-type.enum';
import { IAdditionalDynamicOptions } from './additional/additional-dynamic-options.interface';

/**
 * The definition of a field that represents a *dynamic* control.
 */
export interface IDynamicField<T extends object> extends IField<T>, IAdditionalDynamicOptions<T> {
	/**
	 * The type of the row.
	 */
	type: FieldType.Dynamic;
}