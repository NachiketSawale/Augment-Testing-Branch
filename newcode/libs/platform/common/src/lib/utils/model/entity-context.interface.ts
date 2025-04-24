/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that specifies the entity-related context something is displayed in.
 */
export interface IEntityContext<T extends object> {

	/**
	 * Returns the current entity object.
	 */
	readonly entity?: T;

	/**
	 * Returns the index of the current entity object its containing set, if any.
	 */
	readonly indexInSet?: number;

	/**
	 * Returns the total count of entities in the set.
	 */
	readonly totalCount: number;
}

/**
 * A minimal implementation of the entity context interface.
 * This implementation can be used when there is no further context available other than the entity
 * object itself.
 */
export class MinimalEntityContext<T extends object> implements IEntityContext<T> {

	/**
	 * Gets or sets the current entity object.
	 */
	public entity?: T;

	/**
	 * Returns the index of the current entity object its containing set, if any.
	 */
	public get indexInSet(): number | undefined {
		return this.entity ? 0 : undefined;
	}

	/**
	 * Returns the total count of entities in the set.
	 */
	public get totalCount(): number {
		return 1;
	}
}