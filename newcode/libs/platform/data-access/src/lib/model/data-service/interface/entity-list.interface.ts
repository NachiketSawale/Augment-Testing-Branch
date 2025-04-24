/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import {IEntityComparer} from './entity-comparer.interface';
import { IIdentificationData } from '@libs/platform/common';

/**
 * Interface for list functionality provided entity data services
 * @typeParam T - entity type handled by the data service, needs to extend IEntityIdentification
 */
export interface IEntityList<T extends object> {
	/**
	 * Gets the data entities managed & loaded by the data service
	 * @return all available entities, in case of none, an empty array
	 */
	getList(): T[];

	/**
	 * Sets the data entities
	 * @param entities collection of entities of type T to be managed as the data list
	 */
	setList(entities: T[]): void;

	/**
	 * Adds the passed entities to the already managed entities
	 * @param toAdd collection of entities of type T to be managed as the data list
	 */
	append(toAdd: T[] | T): void;

	/**
	 * Register for listLoaded event
	 * @return return Observable that the list of managed entities has changed
	 */
	 get listChanged$(): Observable<T[]>;

	/**
	 * Removes given entities from internal list
	 * @param entities
	 */
	remove(entities: T[] | T): void;

	/**
	 * Update entities in memory in order to keep in sync with changes done outside (app-server, ...)
	 * @param updated
	 */
	updateEntities(updated: T[]): void;

	/**
	 * returns true, if there is at least one element in the entity list, else false
	 */
	any(): boolean;

	/**
	 * returns a class comparing elements based on key property/ies
	 */
	assertComparer(): IEntityComparer<T>

	/**
	 * Gets the identification data for all loaded entities.
	 */
	getAllIds(): IIdentificationData[];
}