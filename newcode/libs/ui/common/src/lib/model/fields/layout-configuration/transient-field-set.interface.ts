/*
 * Copyright(c) RIB Software GmbH
 */

import { ConcreteField } from '../concrete-field.type';
import { ConcreteFieldOverload } from './concrete-field-overload.type';
import { IAdditionalColumnProperties } from '../../../grid';

/**
 * Specifies multiple transient fields depending on the target container type.
 *
 * @typeParam T The entity type.
 *
 * @group Layout Configuration
 */
export interface ITransientFieldSet<T extends object> {

	/**
	 * The ID of the field, unique within the enclosing layout.
	 */
	id: string;

	/**
	 * Common definition elements to be used in all target containers.
	 */
	common?: Omit<Partial<ConcreteField<T> & IAdditionalColumnProperties>, 'id'>;

	/**
	 * The field definition to use in the grid container.
	 */
	grid?: ConcreteFieldOverload<T> & Partial<IAdditionalColumnProperties>;

	/**
	 * The field definition to use in the form container.
	 */
	form?: ConcreteFieldOverload<T>;
}
