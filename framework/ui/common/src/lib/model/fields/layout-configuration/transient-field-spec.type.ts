/*
 * Copyright(c) RIB Software GmbH
 */

import { ConcreteField } from '../concrete-field.type';
import { ITransientFieldSet } from './transient-field-set.interface';
import { IAdditionalColumnProperties } from '../../../grid';

/**
 * Specifies a transient field in a layout.
 *
 * Transient fields can be specified either as a single field, or as a transient field set, which
 * contains different field definitions for different target container types.
 *
 * @typeParam T The entity type.
 *
 * @group Layout Configuration
 */
export type TransientFieldSpec<T extends object> = (ConcreteField<T> & Partial<IAdditionalColumnProperties>) | ITransientFieldSet<T>;

/**
 * Checks whether a given transient field specification is a transient field set.
 *
 * Transient fields can be specified either as a single field, or as a transient field set, which
 * contains different field definitions for different target container types.
 * This typeguard function checks whether a given transient field specification is such a transient field
 * set.
 *
 * @param spec The transient field specification to check.
 *
 * @typeParam T The entity type.
 *
 * @group Layout Configuration
 */
export function isTransientFieldSet<T extends object>(spec?: TransientFieldSpec<T>): spec is ITransientFieldSet<T> {
	if (spec && typeof spec === 'object') {
		if (Object.prototype.hasOwnProperty.call(spec, 'grid') || Object.prototype.hasOwnProperty.call(spec, 'form')) {
			return true;
		}
	}

	return false;
}
