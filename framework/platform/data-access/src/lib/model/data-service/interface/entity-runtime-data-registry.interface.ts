import { IFieldValidationResult, IReadOnlyField } from '../../runtime-data/entity-runtime-data.class';
import { IReadOnlyEntityRuntimeDataRegistry } from './readonly-entity-runtime-data-registry.interface';


/**
 * Interface for management of validation issues on the data service
 * @typeParam T - entity type handled by the data service
 */
export interface IEntityRuntimeDataRegistry<T extends object> extends IReadOnlyEntityRuntimeDataRegistry<T> {
	/**
	 * Removes a validation issue from the validation issue register
	 * @param entity - information about entity unsuccessful validated
	 * @param result - information about property and error
	 */
	removeInvalid(entity: T, result: IFieldValidationResult<T>): void

	/**
	 * Adds a validation issue to the validation issue register
	 * @param entity - information about entity unsuccessful validated
	 * @param result - information about property and error
	 */
	addInvalid(entity: T, result: IFieldValidationResult<T>): void


	/**
	 * set entire entity to passed readonly state
	 * @param entity
	 * @param readonly
	 */
	setEntityReadOnly(entity: T, readonly: boolean): void


	/**
	 * set some fields of entity readonly
	 * @param entity information about entity unsuccessful validated
	 * @param readonlyFields information about fields to set readonly or not
	 */
	setEntityReadOnlyFields(entity: T, readonlyFields: IReadOnlyField<T>[]): void

}
