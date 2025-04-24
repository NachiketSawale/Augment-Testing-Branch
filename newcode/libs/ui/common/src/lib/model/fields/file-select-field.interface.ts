/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IField } from './field.interface';
import { FieldType } from './field-type.enum';
import { IAdditionalFileSelectOptions } from './additional/additional-file-select-options.interface';
import { IFileSelectControlResult, PropertyIdentifier, PropertyType } from '@libs/platform/common';

/**
 * The definition of a field that represents a *fileselect* input control.
 *
 * @group Fields API
 */
export interface IFileSelectField<T extends object> extends IField<T>, IAdditionalFileSelectOptions {
	/**
	 * The type of the row.
	 */
	type: FieldType.FileSelect;

	/**
	 * The property that represents the data model for the field, restricted to `File` values.
	 */
	model?: PropertyIdentifier<T, PropertyType> & PropertyIdentifier<T, IFileSelectControlResult | IFileSelectControlResult[]>;
}
