/*
 * Copyright(c) RIB Software GmbH
 */

import { IFieldOverload } from './field-overload.interface';
import { FieldType } from '../field-type.enum';
import { IAdditionalLookupOptions } from '../additional/additional-lookup-options.interface';

/**
 * Options overload for lookup fields in a layout configuration.
 *
 * @group Layout Configuration
 */
export interface ILookupFieldOverload<T extends object> extends IFieldOverload<T>, IAdditionalLookupOptions<T> {

	/**
	 * A concrete type to use.
	 */
	readonly type?: FieldType.Lookup;
}