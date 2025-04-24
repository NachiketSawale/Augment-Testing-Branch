/*
 * Copyright(c) RIB Software GmbH
 */

import { IFieldOverload } from './field-overload.interface';
import { FieldType } from '../field-type.enum';

/**
 * Options overload for UTC date fields in a layout configuration.
 *
 * @group Layout Configuration
 */
export interface IDateUtcFieldOverload<T extends object> extends IFieldOverload<T> {

	/**
	 * A concrete type to use.
	 */
	readonly type?: FieldType.DateUtc;
}