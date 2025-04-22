/*
 * Copyright(c) RIB Software GmbH
 */

import { PropertyPath } from '@libs/platform/common';

import { ValidationResult } from '../validation/validation-result.class';
import { IReadOnlyEntityRuntimeData } from './read-only-entity-runtime-data.interface';

export interface IFieldInfo<T extends object> {

	/**
	 * The path to the field.
	 */
	field: PropertyPath<T>;
}

export interface IReadOnlyField<T extends object> extends IFieldInfo<T> {

	/**
	 * Indicates whether the field is read-only.
	 */
	readOnly: boolean;
}

export interface IFieldValidationResult<T extends object> extends IFieldInfo<T> {

	/**
	 * The validation result for the field.
	 */
	result: ValidationResult;
}

/**
 * Stores runtime data for an entity object.
 *
 * An entity object is strongly typed and modeled based on a DTO type that is received from and understood by the backend.
 * The entity object is typically serialized and sent to the backend at some point.
 * Therefore, the entity object should indeed only contain information relevant for the backend.
 *
 * Sometimes, however, we need to keep track of additional information about the entity object.
 * Examples include:
 *
 * - The read-only (disabled) state of fields in the entity object.
 * - Validation results for the fields of the entity object.
 *
 * For this purpose, the entity object may be accompanied by a separate *runtime data* object.
 * The runtime data object stores the temporary data only required at runtime.
 *
 * Typically, the data service that retrieved the entity object is also responsible for creating and providing the runtime
 * data object, when necessary.
 * Code that processes the entity object while taking into account runtime data should be supplied with the runtime data
 * object along with the entity object.
 *
 * The runtime data object should, however, always be treated as optional.
 * If no runtime data object is available for a given entity object, the default runtime information should be assumed, that is:
 *
 * - No fields are disabled or in read-only state.
 * - Validation did not produce any messages.
 *
 * ## AngularJS Migration Notes
 *
 * In the original AngularJS implementation, runtime data was stored directly in the entity object in a `rt$data` property.
 * This concept was changed for the Angular implementation in order to maintain the typesafe entity interface without allowing for any dynamically added fields.
 */
export class EntityRuntimeData<T extends object> implements IReadOnlyEntityRuntimeData<T> {

	/**
	 * Stores read-only flags for fields directly or indirectly in the object.
	 */
	public readOnlyFields: IReadOnlyField<T>[] = [];

	/**
	 * Stores validation results for fields directly or indirectly in the object.
	 */
	public validationResults: IFieldValidationResult<T>[] = [];

	/**
	 * Flag marking the entire entity as readonly
	 */
	public entityIsReadOnly: boolean = false;
}
