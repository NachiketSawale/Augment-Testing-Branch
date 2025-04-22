/*
 * Copyright(c) RIB Software GmbH
 */

import { IFieldOverload } from './field-overload.interface';
import { FieldType } from '../field-type.enum';
import {
	IAdditionalCustomComponentOptions
} from '../additional/additional-custom-component-options.interface';

/**
 * Options overload for custom component fields in a layout configuration.
 *
 * @group Layout Configuration
 */
export interface ICustomComponentFieldOverload<T extends object> extends IFieldOverload<T>, IAdditionalCustomComponentOptions {

	/**
	 * A concrete type to use.
	 */
	readonly type?: FieldType.CustomComponent;
}