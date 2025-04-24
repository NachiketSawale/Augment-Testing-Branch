/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityList } from './entity-list.interface';

/**
 * Interface for list functionality provided entity data services
 * @typeParam T - entity type handled by the data service, needs to extend IEntityIdentification
 */
export interface IEntityTree<T extends object> extends IEntityList<T> {
	/**
	 * Adds the passed entities to the already managed entities
	 * @param toAdd collection of entities of type T to be managed as the data list
	 * @param parent element the entities are added to. In case of null, the element are regarded as root
	 */
	appendTo(toAdd: T[] | T, parent: T | null): void;

	/**
	 * returns the top level elements of the entity tree
	 */
	rootEntities(): T[]

	/**
	 * Returns the children elements assigned to the element, maybe an empty array.
	 * @param element the element which children are looked for
	 */
	childrenOf(element: T): T[]


	/**
	 * Returns the parent element assigned of the element, null in case it is a root of the tree.
	 * @param element the element which parent is looked for
	 */
	parentOf(element: T): T | null;

	/**
	 * Returns the flattened entity tree
	 */
	flatList(): T[]
}