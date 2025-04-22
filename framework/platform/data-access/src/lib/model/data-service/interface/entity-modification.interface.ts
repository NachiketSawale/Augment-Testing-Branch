/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';

/**
 * Interface for list functionality provided entity data services
 * @typeParam T - entity type handled by the data service
 */
export interface IEntityModification<T> {

	/**
	 * Sets entities modified
	 * @param entities to be set modified
	 */
	setModified(entities: T[] | T): void

	/**
	 * Publish entities as updated
	 * @param entities which were updated
	 */
	entitiesUpdated(entities: T[] | T): void

	/**
	 * Removes modified entities
	 * @param entities items to be removed from the modification
	 */
	removeModified(entities: T[] | T): void;

	/**
	 * get all modified Items of T
	 */
	getModified(): T[];

	/**
	 * get all modified entities related to the parent
	 */
	getModifiedFor(parentKey: object): T[];

	/**
	 * get all deleted Entities of T
	 */
	getDeleted(): T[];

	/**
	 * get all deleted entities related to the parent
	 */
	getDeletedFor(parentKey: object): T[];

	/**
	 * Register for entitiesModified$ event
	 * @return Observable indicating that items of managed entities has been modified
	 */
	get entitiesModified$(): Observable<T[]>;

	/**
	 * Marks given entities as deleted
	 * @param entities
	 */
	setDeleted(entities: T[] | T): void;

	/**
	 * gives back boolean weather this modification instance holds modification
	 */
	hasModifiedFor(parentKey: object): boolean;

	/**
	 * clear the container in which the modified and deleted entities are administered
	 */
	clearModifications(): void

	/**
	 * Register for entitiesUpdated$ event
	 * @return Observable indicating that entities have been updated e.g. after after update call
	 */
	get entitiesUpdated$(): Observable<T[]>;
}