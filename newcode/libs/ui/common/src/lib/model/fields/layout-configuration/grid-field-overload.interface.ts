/*
 * Copyright(c) RIB Software GmbH
 */

import { IFieldOverload } from './field-overload.interface';
import { IAdditionalGridOptions } from '../additional/additional-grid-options.interface';
import { FieldType } from '../field-type.enum';
import { IReadOnlyPropertyAccessor } from '@libs/platform/common';

/**
 * Options overload for form-grid fields in a layout configuration.
 *
 * @group Layout Configuration
 */
export interface IGridFieldOverload<T extends object> extends IFieldOverload<T>, IAdditionalGridOptions {

	/**
	 * A concrete type to use.
	 */
	readonly type?: FieldType.Grid;

	/**
	 * A custom object to get and set the value on the underlying entity object.
	 */
	readonly valueAccessor?: IReadOnlyPropertyAccessor<T, []>;
}