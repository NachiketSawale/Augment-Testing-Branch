/*
 * Copyright(c) RIB Software GmbH
 */

import { IFieldOverload } from './field-overload.interface';
import { FieldType } from '../field-type.enum';
import { ColorType, IReadOnlyPropertyAccessor } from '@libs/platform/common';
import { IAdditionalColorOptions } from '../additional/additional-color-options.interface';

/**
 * Options overload for color fields in a layout configuration.
 *
 * @group Layout Configuration
 */
export interface IColorFieldOverload<T extends object> extends IFieldOverload<T>, IAdditionalColorOptions {

	/**
	 * A concrete type to use.
	 */
	readonly type?: FieldType.Color;

	/**
	 * A custom object to get and set the value on the underlying entity object.
	 */
	readonly valueAccessor?: IReadOnlyPropertyAccessor<T, ColorType>;
}