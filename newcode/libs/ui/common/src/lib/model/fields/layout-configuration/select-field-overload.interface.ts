/*
 * Copyright(c) RIB Software GmbH
 */

import { IFieldOverload } from './field-overload.interface';
import { FieldType } from '../field-type.enum';
import { IReadOnlyPropertyAccessor } from '@libs/platform/common';
import { IAdditionalSelectOptions } from '../additional/additional-select-options.interface';

/**
 * Options overload for select fields in a layout configuration.
 *
 * @group Layout Configuration
 */
export interface ISelectFieldOverload<T extends object> extends IFieldOverload<T>, IAdditionalSelectOptions {

	/**
	 * A concrete type to use.
	 */
	readonly type?: FieldType.Select | FieldType.ImageSelect;

	/**
	 * A custom object to get and set the value on the underlying entity object.
	 */
	readonly valueAccessor?: IReadOnlyPropertyAccessor<T>;
}