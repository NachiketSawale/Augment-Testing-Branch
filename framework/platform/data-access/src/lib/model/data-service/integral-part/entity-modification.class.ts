/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable, ReplaySubject } from 'rxjs';
import { CollectionHelper } from '@libs/platform/common';
import { IEntityModification } from '../interface/entity-modification.interface';
import { IDataServiceOptions } from '../interface/options/data-service-options.interface';
import { IEntityComparer } from '../interface/entity-comparer.interface';

/**
 * Class for list functionality provided entity data services
 * @typeParam T - entity type handled by the data service
 */

export class EntityModification<T extends object> implements IEntityModification<T> {
	protected modifiedItems: T[] = [];
	protected deletedItems: T[] = [];
	protected itemsModified$ = new ReplaySubject<T[]>(1);
	protected _entitiesUpdated$ = new ReplaySubject<T[]>(1);

	public constructor(protected modificationOptions: IDataServiceOptions<T>, protected comparerCreateFn: () => IEntityComparer<T>, protected isParentFn: (parentKey: object, entity: T) => boolean) {

	}

	/**
	 * get all modified Items of T
	 */
	public getModified(): T[] {
		return this.modifiedItems;
	}

	/**
	 * get all modified Items of T
	 */
	public getModifiedFor(parentKey: object): T[] {
		if (typeof this.isParentFn !== 'undefined') {
			return this.modifiedItems.filter((e) => this.isParentFn(parentKey, e));
		}
		return this.modifiedItems;
	}

	/**
	 * get all modified Items of T
	 */
	public getDeleted(): T[] {
		return this.deletedItems;
	}

	/**
	 * get all modified Items of T
	 */
	public getDeletedFor(parentKey: object): T[] {
		// TODO: need to determine the type of parent.
		if (typeof this.isParentFn !== 'undefined') {
			return this.deletedItems.filter((e) => this.isParentFn(parentKey, e));
		}
		return this.deletedItems;
	}

	/**
	 * Register for registerItemModified event
	 * @return Observable indicating that an item of managed entities has been modified
	 */
	public get entitiesModified$(): Observable<T[]> {
		return this.itemsModified$;
	}

	/**
	 * Register for entitiesUpdated$ event
	 * @return Observable indicating that an item of managed entities has been modified
	 */
	public get entitiesUpdated$(): Observable<T[]> {
		return this._entitiesUpdated$.asObservable();
	}

	public removeModified(entities: T[] | T): void {
		const comparer = this.comparerCreateFn();
		CollectionHelper.RemoveFromWithComparer(entities, this.modifiedItems, comparer.compare);
	}

	/**
	 * Sets items modified
	 * @param entities to be set modified
	 */
	public setModified(entities: T[] | T): void {
		const asArray: T[] = CollectionHelper.AsArray(entities);

		if (asArray.length > 0) {
			if (this.modifiedItems.length === 0) {
				this.modifiedItems.push(...asArray);
			} else {
				const comparer = this.comparerCreateFn();
				asArray.forEach(modified => {
					if (!this.modifiedItems.find(entry => comparer.compare(entry, modified) === 0)) {
						this.modifiedItems.push(modified);
					}
				});
			}

			this.itemsModified$.next(asArray);
		}
	}

	public entitiesUpdated(entities: T[] | T): void {
		const asArray: T[] = CollectionHelper.AsArray(entities);
		if (asArray.length > 0) {
			this._entitiesUpdated$.next(asArray);
		}
	}

	/**
	 * Marks given entities as deleted
	 * @param entities
	 */
	public setDeleted(entities: T[] | T): void {
		const comparer = this.comparerCreateFn();

		CollectionHelper.RemoveFromWithComparer(entities, this.modifiedItems, comparer.compare);
		CollectionHelper.AppendTo(entities, this.deletedItems);
	}

	public hasModifiedFor(parentKey: object): boolean {
		const mods: T[] = [];

		mods.push(...this.getModifiedFor(parentKey));
		mods.push(...this.getDeletedFor(parentKey));

		return mods.some(() => true);
	}

	/**
	 * clear the container in which the modified and deleted entities are administered
	 */
	public clearModifications(): void {
		this.modifiedItems = [];
		this.deletedItems = [];
	}

}