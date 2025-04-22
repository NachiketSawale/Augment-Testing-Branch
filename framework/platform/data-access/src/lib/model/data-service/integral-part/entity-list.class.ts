/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityList } from '../interface/entity-list.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { CollectionHelper, IIdentificationData } from '@libs/platform/common';
import { IEntityComparer } from '../interface/entity-comparer.interface';
import { IIdentificationDataConverter } from '../interface/identification-data-converter.interface';

/**
 * Class for list functionality provided entity data services
 * @typeParam T - entity type handled by the data service
 */
export class EntityList<T extends object> implements IEntityList<T> {
	protected entities: T[] = [];
	protected entities$ = new ReplaySubject<T[]>(1);
	protected comparer: IEntityComparer<T> | null = null;

	/**
	 * Constructor
	 * @param comparerCreateFn
	 * @param converter helper class used to convert entity to IdentificationData
	 */
	public constructor(protected comparerCreateFn: () => IEntityComparer<T>, private converter: IIdentificationDataConverter<T>) {

	}

	/**
	 * Gets the data entities managed & loaded by the data service
	 * @return all available elements, in case of none, an empty array
	 */
	public getList(): T[] {
		return this.entities;
	}

	/**
	 * Register for listLoaded event
	 * @return return Observable indicating that the list of managed entities has changed
	 */
	public get listChanged$(): Observable<T[]> {
		return this.entities$;
	}

	/**
	 * Sets the data entities
	 * @param entities collection of entities of type T to be managed as the data list
	 */
	public setList(entities: T[]): void {
		this.entities = entities;
		this.entities$.next(this.entities);
	}

	/**
	 * Adds the passed entities to the already managed entities
	 * @param toAdd collection of entities of type T to be managed as the data list
	 */
	public append(toAdd: T[] | T): void {
		CollectionHelper.AppendTo(toAdd, this.entities);
		this.entities$.next(this.entities);
	}

	/**
	 * Removes given entities from internal list
	 * @param entities
	 */
	public remove(entities: T[] | T): void {
		const comparer = this.assertComparer();
		CollectionHelper.RemoveFromWithComparer(entities, this.entities, comparer.compare);
		this.entities$.next(this.entities);
	}

	/**
	 * Update entities in memory in order to keep in sync with changes done outside (app-server, ...)
	 * @param updated
	 */
	public updateEntities(updated: T[]): void {
		if (updated.length > 0) {
			const comparer = this.assertComparer();
			CollectionHelper.UpdateEntitiesWithComparer(updated, this.entities, comparer.compare);
		}
	}

	/**
	 * returns true, when at least one element is in the list
	 */
	public any(): boolean {
		return this.entities.length > 0;
	}

	public assertComparer(): IEntityComparer<T> {
		if (this.comparer === null) {
			this.comparer = this.comparerCreateFn();
		}

		return this.comparer;
	}

	/**
	 * Gets the identification data for all loaded entities.
	 * @returns An array of identification data.
	 */
	public getAllIds(): IIdentificationData[] {
		const identificationIds: IIdentificationData[] = [];
		this.getList().forEach(entity => {
			const identificationId = this.converter.convert(entity, true);
			if (identificationId !== null) {
				identificationIds.push(identificationId);
			}
		});
		return identificationIds;
	}
}