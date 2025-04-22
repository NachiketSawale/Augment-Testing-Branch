/*
 * Copyright(c) RIB Software GmbH
 */

import { ConcreteFieldOverload } from './concrete-field-overload.type';
import { IAdditionalColumnProperties } from '../../../grid';

/**
 * Specifies multiple field overloads depending on the target container type.
 *
 * @typeParam T The entity type.
 *
 * @group Layout Configuration
 */
export interface IFieldOverloadSet<T extends object> {

	/**
	 * The field overload to use in the grid container.
	 */
	grid?: ConcreteFieldOverload<T> & Partial<IAdditionalColumnProperties>;

	/**
	 * The field overload to use in the form container.
	 */
	form?: ConcreteFieldOverload<T>;
}
