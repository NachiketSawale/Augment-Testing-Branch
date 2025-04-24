/*
 * Copyright(c) RIB Software GmbH
 */

import { IFieldOverload } from './field-overload.interface';
import { IAdditionalNumericOptions } from '../additional/additional-numeric-options.interface';
import { NumericFieldType } from '../field-type.enum';
import { IReadOnlyPropertyAccessor } from '@libs/platform/common';

/**
 * Options overload for numeric fields in a layout configuration.
 *
 * @group Layout Configuration
 */
export interface INumericFieldOverload<T extends object> extends IFieldOverload<T>, IAdditionalNumericOptions {

	/**
	 * A concrete type to use.
	 */
	readonly type?: NumericFieldType;

	/**
	 * A custom object to get and set the value on the underlying entity object.
	 */
	readonly valueAccessor?: IReadOnlyPropertyAccessor<T, number>;
}