/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { FieldType } from './field-type.enum';
import { IField } from './field.interface';
import { IAdditionalLookupOptions } from './additional/additional-lookup-options.interface';

/**
 * The definition of a field that represents a *lookup input select* input control.
 * User could enter free value in the input control or select one value from lookup dropdown
 *
 * @group Fields API
 */
export interface ILookupInputSelectField<T extends object> extends IField<T>, IAdditionalLookupOptions<T> {

	/**
	 * The type of the row.
	 */
	type: FieldType.LookupInputSelect;
}
