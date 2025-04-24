/*
 * Copyright(c) RIB Software GmbH
 */


import {IEntityTree} from '../interface/entity-tree.interface';
import {IEntityList} from '../interface/entity-list.interface';
import {IEntityComparer} from '../interface/entity-comparer.interface';
import {EntityList} from './entity-list.class';
import {Observable} from 'rxjs';
import { CollectionHelper, IIdentificationData } from '@libs/platform/common';
import { IIdentificationDataConverter } from '../interface/identification-data-converter.interface';

export class EntityTree<T extends object> implements IEntityTree<T> {
	protected rootList: IEntityList<T>;
	protected completeList: IEntityList<T>;

	/**
	 * Constructor
	 * @param comparerCreateFn
	 * @param getChildrenFn
	 * @param getParentFn
	 * @param converter helper class used to convert entity to IdentificationData
	 */
	public constructor(
		protected comparerCreateFn:() => IEntityComparer<T>,
	  protected getChildrenFn: (parent: T) => T[],
		protected getParentFn: (child: T) => T | null,
		converter: IIdentificationDataConverter<T>
	) {
		this.rootList = new EntityList<T>(comparerCreateFn, converter);
		this.completeList = new EntityList<T>(comparerCreateFn, converter);
	}

	public any(): boolean {
		return this.rootList.any();
	}

	public append(toAdd: T[] | T): void {
		return this.appendTo(toAdd, null);
	}

	public appendTo(toAdd: T[] | T, parent: T | null): void {
		if(parent === null) {
			this.rootList.append(toAdd);
			this.completeList.append(CollectionHelper.Flatten(toAdd, this.getChildrenFn));
		} else {
			CollectionHelper.AppendTo(toAdd, this.getChildrenFn(parent));// Line CHECKBEFORE
			// The following statement is correct but may be a bottleneck. For optimization:
			// 1. Find last entry belonging to parent (including all children of parent) before line CHECKBEFORE is done
			// 2. Find position of this element in the flat list.
			// 3. Insert flattened toAdd list in the next place. In case the found position is the last, just append.
			this.setList(this.rootList.getList());
		}
	}

	public assertComparer(): IEntityComparer<T> {
		this.completeList.assertComparer();
		return this.rootList.assertComparer();
	}

	public childrenOf(element: T): T[] {
		return this.getChildrenFn(element);
	}

	public parentOf(element: T): T | null {
		return this.getParentFn(element);
	}

	public getList(): T[] {
		return this.rootList.getList();
	}

	public getAllIds(): IIdentificationData[] {
		return this.completeList.getAllIds();
	}

	public flatList(): T[] {
		return this.completeList.getList();
	}

	public get listChanged$(): Observable<T[]> {
		return this.rootList.listChanged$;
	}

	public remove(entities: T[] | T): void {
		// Remove entities from the flat list
		const flattened = CollectionHelper.Flatten(entities, this.getChildrenFn);
		this.completeList.remove(flattened);

		// In case entities are root, the elements should be removed
		this.rootList.remove(entities);

		// In case an element is a child, it has to be removed from the parents children array
		const comparer = this.comparerCreateFn();
		const entityArray = CollectionHelper.AsArray(entities);
		entityArray.forEach(entity => {
			const parent = this.parentOf(entity);
			if(parent !== null) {
				CollectionHelper.RemoveFromWithComparer(entity, this.childrenOf(parent), comparer.compare);
			}
		});
	}

	public rootEntities(): T[] {
		return this.rootList.getList();
	}

	public setList(entities: T[]): void {
		this.completeList.setList(CollectionHelper.Flatten(entities, this.getChildrenFn));

		this.rootList.setList(entities);
	}

	public updateEntities(updated: T[]): void {
		this.completeList.updateEntities(updated);
	}
}