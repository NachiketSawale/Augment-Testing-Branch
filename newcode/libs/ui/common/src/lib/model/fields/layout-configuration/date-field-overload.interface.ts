/*
 * Copyright(c) RIB Software GmbH
 */

import { IFieldOverload } from './field-overload.interface';
import { FieldType } from '../field-type.enum';

/**
 * Options overload for date fields in a layout configuration.
 *
 * @group Layout Configuration
 */
export interface IDateFieldOverload<T extends object> extends IFieldOverload<T> {

	/**
	 * A concrete type to use.
	 */
	readonly type?: FieldType.Date;
}