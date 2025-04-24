/*
 * Copyright(c) RIB Software GmbH
 */

import { IField } from './field.interface';
import {
	IAdditionalCustomTranslateOptions
} from './additional/additional-custom-translate-options.interface';
import { FieldType } from './field-type.enum';
import { PropertyIdentifier, PropertyType } from '@libs/platform/common';

/**
 * The definition of a field that represents a custom translation.
 *
 * @group Fields API
 */
export interface ICustomTranslateField<T extends object> extends IField<T>, IAdditionalCustomTranslateOptions {

	/**
	 * The type of the field.
	 */
	type: FieldType.CustomTranslate;

	/**
	 * The property that represents the data model for the field, restricted to date values.
	 */
	model?: PropertyIdentifier<T, PropertyType> & PropertyIdentifier<T, string>;
}