/*
 * Copyright(c) RIB Software GmbH
 */

import { IFieldOverload } from './field-overload.interface';
import { FieldType } from '../field-type.enum';
import { IAdditionalCompositeOptions } from '../additional/additional-composite-options.interface';

/**
 * Options overload for composite fields in a layout configuration.
 *
 * @group Layout Configuration
 */
export interface ICompositeFieldOverload<T extends object> extends IFieldOverload<T>, IAdditionalCompositeOptions<T> {

	/**
	 * A concrete type to use.
	 */
	readonly type?: FieldType.Composite;
}