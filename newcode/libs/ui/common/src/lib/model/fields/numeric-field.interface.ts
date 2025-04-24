/*
 * Copyright(c) RIB Software GmbH
 */

import {IField} from './field.interface';
import { PropertyIdentifier, PropertyType } from '@libs/platform/common';
import { IAdditionalNumericOptions } from './additional/additional-numeric-options.interface';

/**
 * The base interface for fields that provide a number input box.
 *
 * @group Fields API
 */
export interface INumericField<T extends object> extends IField<T>, IAdditionalNumericOptions {

	/**
	 * The property that represents the data model for the field, restricted to numeric values.
	 */
	model?: PropertyIdentifier<T, PropertyType> & PropertyIdentifier<T, number>;
}