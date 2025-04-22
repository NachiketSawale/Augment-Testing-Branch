/**
 * Interface for verification if create is allowed for an entity
 * @typeParam T - entity type handled by the data service
 */
export interface IEntityCreateGuard<T> {
    /**
     * Verifies, if create is allowed
     * @return true only if create is allowed for the passed entity (which can be null for a general statement)
     * @param entity selected element in parent data service
     */
    isCreateAllowed(entity: T | null): boolean
}
