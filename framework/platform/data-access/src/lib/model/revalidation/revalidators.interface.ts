import { Validator } from '../validation/validator.type';
import { Revalidator } from './revalidator.type';


/**
 * Interface for entity (Re)ValidationServices that extends from BaseRevalidationService
 * @typeParam T - entity on which this revalidation takes place
 * @group validation
 */
export interface IRevalidator<T extends object> {
	/**
	 * a field/property of T entered here will result in revalidating this validator,
	 * when a change happens on that field.
	 * Be aware that whole (re)validation chain on each ravalidation field will be retriggerd.
	 */
	dependsOn?: (keyof T)[]
	/**
	 * Basicly same as on BaseValidationService, but the (re)validator call back can take instead a RevalidationInfo
	 */
	validator?: Revalidator<T> | Validator<T>
	/**
	 * Only trigger a revalidation when already an error is on the field to revalidate
	 */
	revalidateOnlyIfHasError?: boolean
	/**
	 * revalidates only same entity/row and(logical and) field/columns set by dependsOn. It is usefull when
	 * only on the same entity/row another field(s) needs to be revalidated.
	 */
	revalidateOnlySameEntity?: boolean
}