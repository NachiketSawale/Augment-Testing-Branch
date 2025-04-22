/*
 * Copyright(c) RIB Software GmbH
 */

import {IField} from './field.interface';
import {IAdditionalStringOptions} from './additional/additional-string-options.interface';
import { PropertyIdentifier, PropertyType } from '@libs/platform/common';

/**
 * The base interface for fields that provide a text input box.
 *
 * @group Fields API
 */
export interface IStringField<T extends object> extends IField<T>, IAdditionalStringOptions {

	/**
	 * The property that represents the data model for the field, restricted to string values.
	 */
	model?: PropertyIdentifier<T, PropertyType> & PropertyIdentifier<T, string>;
}