/*
 * Copyright(c) RIB Software GmbH
 */

import { IFieldOverload } from './field-overload.interface';
import { FieldType } from '../field-type.enum';

/**
 * Options overload for password fields in a layout configuration.
 *
 * @group Layout Configuration
 */
export interface IPasswordFieldOverload<T extends object> extends IFieldOverload<T>{

	/**
	 * A concrete type to use.
	 */
	readonly type?: FieldType.Password;
}