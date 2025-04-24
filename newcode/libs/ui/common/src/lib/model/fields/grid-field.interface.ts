/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType } from './field-type.enum';
import { IField } from './field.interface';
import { IAdditionalGridOptions } from './additional/additional-grid-options.interface';
import { PropertyIdentifier, PropertyType } from '@libs/platform/common';

/**
 * The definition of a field that represents a *grid* control.
 *
 * @group Fields API
 */
export interface IGridField<T extends object> extends IField<T>, IAdditionalGridOptions {

	/**
	 * The type of the row.
	 */
	type: FieldType.Grid;

	/**
	 * The property that represents the data model for the field, restricted to an array.
	 */
	model?: PropertyIdentifier<T, PropertyType> & PropertyIdentifier<T, []>;
}

