import { IFieldValidationResult, IReadOnlyField } from '../../runtime-data/entity-runtime-data.class';
import { IReadOnlyEntityRuntimeData } from '../../runtime-data';

/**
 * Interface for management of validation issues on the data service
 * @typeParam T - entity type handled by the data service
 */
export interface IReadOnlyEntityRuntimeDataRegistry<T extends object> {

	/**
	 * get all validation errors for a given entity
	 * @param entity - information about entity unsuccessful validated
	 */
	getValidationErrors(entity: T): IFieldValidationResult<T>[]

	/**
	 * get all entities with validation errors
	 */
	getInvalidEntities(): T[]

	/**
	 * Quick check of there are any invalid entities registered on this data service
	 */
	hasValidationErrors(): boolean

	/**
	 *
	 */
	isEntityReadOnly(entity: T): boolean

	/**
	 * @param entity information about entity unsuccessful validated
	 */
	getEntityReadOnlyFields(entity: T): IReadOnlyField<T>[]

	/**
	 *
	 * @param entity - the entity the runtime data is requested from
	 */
	getEntityReadonlyRuntimeData(entity: T): IReadOnlyEntityRuntimeData<T> | null
}