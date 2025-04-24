import { IIdentificationData } from '@libs/platform/common';

/**
 * Interface for converting entities into their IIdentificationData for unique identifiation in database,
 * but as well array / grid ... in the user interface
 * @typeParam T - entity type handled by the data service
 */
export interface IIdentificationDataConverter<T> {
	/**
	 * Creates an IIdentificationData object for the given entity
	 * @param entity The element that should be converted into an identification data
	 * @return An identification data representing the passed entity
	 */
	convert(entity: T): IIdentificationData | null

	/**
	 * Creates an IIdentificationData object for the given entity
	 * @param entity The element that should be converted into an identification data
	 * @param isParentEntity Determines if the conversion is happening for the parent or the child entity.
	 * @return An identification data representing the passed entity
	 */
	convert(entity: T, isParentEntity: boolean): IIdentificationData | null
}


