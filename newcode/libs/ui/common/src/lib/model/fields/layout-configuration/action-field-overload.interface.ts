/*
 * Copyright(c) RIB Software GmbH
 */

import { IFieldOverload } from './field-overload.interface';
import { FieldType } from '../field-type.enum';
import { IReadOnlyPropertyAccessor } from '@libs/platform/common';
import { IAdditionalActionOptions } from '../additional/additional-action-options.interface';
import { ConcreteMenuItem } from '../../menu-list/interface';

/**
 * Options overload for action fields in a layout configuration.
 *
 * @group Layout Configuration
 */
export interface IActionFieldOverload<T extends object> extends IFieldOverload<T>, IAdditionalActionOptions<T> {

	/**
	 * A concrete type to use.
	 */
	readonly type?: FieldType.Action;

	/**
	 * A custom object to get and set the value on the underlying entity object.
	 */
	readonly valueAccessor?: IReadOnlyPropertyAccessor<T, ConcreteMenuItem[]>;
}
