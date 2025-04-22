/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType } from '../field-type.enum';
import { IFieldOverload } from './field-overload.interface';
import { IAdditionalCustomTranslateOptions } from '../additional/additional-custom-translate-options.interface';
import { IReadOnlyPropertyAccessor } from '@libs/platform/common';

/**
 * Options overload for custom translation fields in a layout configuration.
 *
 * @group Layout Configuration
 */
export interface ICustomTranslateFieldOverload<T extends object> extends IFieldOverload<T>, IAdditionalCustomTranslateOptions {

	/**
	 * A concrete type to use.
	 */
	readonly type?: FieldType.CustomTranslate;

	/**
	 * A custom object to get and set the value on the underlying entity object.
	 */
	readonly valueAccessor?: IReadOnlyPropertyAccessor<T, string>;
}