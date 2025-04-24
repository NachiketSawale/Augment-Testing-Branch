/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IField} from './field.interface';
import {FieldType} from './field-type.enum';
import { PropertyType } from '@libs/platform/common';
import { IAdditionalSelectOptions } from './additional/additional-select-options.interface';

/**
 * The definition of a field that represents a *select* control.
 *
 * @group Fields API
 */
export interface ISelectField<T extends object> extends IField<T>, IAdditionalSelectOptions<PropertyType> {

	/**
	 * The type of the row.
	 */
	type: FieldType.Select | FieldType.ImageSelect;
}