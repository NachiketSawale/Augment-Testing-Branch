/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IFieldValidationResult,
	IReadOnlyField
} from './entity-runtime-data.class';

/**
 * Provides read-only access to information about the runtime state of an entity object.
 *
 * @typeParam T The entity type.
 */
export interface IReadOnlyEntityRuntimeData<T extends object> {

	/**
	 * Stores read-only flags for fields directly or indirectly in the object.
	 */
	readonly readOnlyFields: readonly Readonly<IReadOnlyField<T>>[];

	/**
	 * Flag marking the entire entity as readonly
	 */
	readonly entityIsReadOnly: boolean;

	/**
	 * Stores validation results for fields directly or indirectly in the object.
	 */
	readonly validationResults: readonly Readonly<IFieldValidationResult<T>>[];

}