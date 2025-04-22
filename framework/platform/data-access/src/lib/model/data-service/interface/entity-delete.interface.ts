/**
 * Interface for delete and management of delete
 * @typeParam T - entity type handled by the data service
 */
export interface IEntityDelete<T> {
	/**
     * Deletes the passed element(s)
     * @return all selected elements, in case of none selected, an empty array
     */
	delete(entities: T[] | T): void

    /**
     * Checks if currently at least one entity is selected
     * @return true if and only if at least one element is selected
     */
	canDelete(): boolean

	/**
	 * Verifies, if delete is supported.
	 * @return true only if delete is supported
	 */
	supportsDelete(): boolean
}
