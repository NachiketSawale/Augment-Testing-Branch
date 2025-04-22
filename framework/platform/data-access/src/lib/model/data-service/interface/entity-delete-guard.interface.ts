/**
 * Interface for verification if delete is allowed for a list of entities
 * @typeParam T - entity type handled by the data service
 */
export interface IEntityDeleteGuard<T> {
	/**
	 * Verifies, if delete is allowed
	 * @return true only if delete is allowed for the passed entities
	 */
	isDeleteAllowed(entities: T[] | T): boolean
}
