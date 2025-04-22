/*
 * Copyright(c) RIB Software GmbH
 */

import { ConcreteFieldOverload } from './concrete-field-overload.type';
import { IFieldOverloadSet } from './field-overload-set.interface';
import { IAdditionalColumnProperties } from '../../../grid';

/**
 * Specifies a field overload in a layout.
 *
 * Field overloads can be specified either as a single field overload, or as a field overload set, which
 * contains different overloads for different target container types.
 *
 * @typeParam T The entity type.
 *
 * @group Layout Configuration
 */
export type FieldOverloadSpec<T extends object> = (ConcreteFieldOverload<T> & Partial<IAdditionalColumnProperties>) | IFieldOverloadSet<T>;

/**
 * Checks whether a given field overload specification is a field overload set.
 *
 * Field overloads can be specified either as a single field overload, or as a field overload set, which
 * contains different overloads for different target container types.
 * This typeguard function checks whether a given field overload specification is such a field overload
 * set.
 *
 * @param overloadSpec The field overload specification to check.
 *
 * @typeParam T The entity type.
 *
 * @group Layout Configuration
 */
export function isFieldOverloadSet<T extends object>(overloadSpec?: FieldOverloadSpec<T>): overloadSpec is IFieldOverloadSet<T> {
	if (overloadSpec && typeof overloadSpec === 'object') {
		if (Object.prototype.hasOwnProperty.call(overloadSpec, 'grid') || Object.prototype.hasOwnProperty.call(overloadSpec, 'form')) {
			return true;
		}
	}

	return false;
}
