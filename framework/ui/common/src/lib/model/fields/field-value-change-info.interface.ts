/*
 * Copyright(c) RIB Software GmbH
 */

import { PropertyType } from '@libs/platform/common';
import { IField } from './field.interface';

/**
 * Stores some information about a change from one value in a field to another.
 *
 * @typeParam T The object type the field refers to.
 * @typeParam P The type of the property edited in the field.
 *
 * @group Fields API
 */
export interface IFieldValueChangeInfo<T extends object, P extends PropertyType = PropertyType> {

	/**
	 * The old value.
	 */
	readonly oldValue: P | null | undefined;

	/**
	 * The new value.
	 */
	readonly newValue: P | null | undefined;

	/**
	 * Provides access to the underlying field definition.
	 * Note that this is meant for informational purposes only. Performing changes on
	 * this object when it is already rendered in the UI is not guaranteed to have any
	 * particular effect.
	 */
	readonly field: IField<T, P>

	/**
	 * A reference to the entity object being edited.
	 */
	readonly entity: T;
}