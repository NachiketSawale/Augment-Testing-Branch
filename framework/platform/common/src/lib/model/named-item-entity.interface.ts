/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '../interfaces/entity-identification.interface';
import { IDescriptionInfo } from '../model/interfaces/description-info.interface';

/**
 * Represents an object with a name and an ID.
 */
export interface INamedItemEntity {

	/**
	 * The full ID of the object.
	 */
	Id: IEntityIdentification;

	/**
	 * The human-readable name of the object.
	 */
	DescriptionInfo?: IDescriptionInfo;

	/**
	 * The unique identifier of the object.
	 */
	Code?: string;
}

/**
 * A specialized {@link INamedItemEntity} with an additional field to store a simple ID.
 * Use this type if you need to locally assign a scalar ID to the object.
 *
 * @typeParam T The type of the simple ID.
 */
export interface INamedItemEntityWithId<T> extends INamedItemEntity {

	/**
	 * The simple ID.
	 */
	SimpleId?: T;
}
