/*
 * Copyright(c) RIB Software GmbH
 */

import { IFieldOverload } from './field-overload.interface';
import { IAdditionalStringOptions } from '../additional/additional-string-options.interface';
import { StringFieldType } from '../field-type.enum';
import { IReadOnlyPropertyAccessor } from '@libs/platform/common';

/**
 * Options overload for string fields in a layout configuration.
 *
 * @group Layout Configuration
 */
export interface IStringFieldOverload<T extends object> extends IFieldOverload<T>, IAdditionalStringOptions {

	/**
	 * A concrete type to use.
	 */
	readonly type?: StringFieldType;

	/**
	 * A custom object to get and set the value on the underlying entity object.
	 */
	readonly valueAccessor?: IReadOnlyPropertyAccessor<T, string>;
}