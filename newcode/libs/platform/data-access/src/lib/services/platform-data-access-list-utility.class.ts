import { IEntityIdentification } from '@libs/platform/common';
import { EntityComparer } from '../model/data-service/integral-part/entity-comparer.class';
import { IConcreteEntitySchemaProperty } from '../model/entity-schema/concrete-entity-schema-property.interface';

/**
 * Class of Collection of helper methods to handle data belonging to the dataservice
 */
export class PlatformDataAccessListUtility {
	private static comparer = new EntityComparer();
	private static reMapGetParentId<T extends IEntityIdentification>(getParentId : ((n: T) => number | null) | ((n: T) => IEntityIdentification | null)) : ((n: T) => IEntityIdentification | null) {
		return (n: T) => {
			const parentId = getParentId(n);
			if (typeof parentId === 'number'){
				return { Id : parentId };
			} else if(parentId  === null){
				return null;
			} else {
				return parentId as IEntityIdentification;
			}
		};
	}
	public static getRootParentItem<T extends IEntityIdentification>(item: T, mainList: T[], getParentId : ((n: T) => IEntityIdentification | null) | ((n: T) => number | null)) : T {
		const parentId = this.reMapGetParentId(getParentId)(item);
		if(parentId !== null){
			const result = mainList.find(e => this.comparer.compare(e,parentId) === 0);
			if(result !== undefined){
				return this.getRootParentItem(result, mainList, getParentId);
			} else {
				throw new Error('You may not land here: mainList, passed as parameter, is not complete');
			}
		} else {
			return item;
		}
	}
	/**
	 * Return all descendants of the item
	 */
	public static getAllChildren<T extends object>(item : T, getChildren : (n: T) => T[]): T[]{
		const directChildren = getChildren(item);
		const deeperChildren = directChildren.flatMap(e => this.getAllChildren(e, getChildren));
		return deeperChildren.concat(directChildren);
	}
	public static sortList<T extends object>(items : T[], mapToField : ((item: T) => string | null) | ((item: T) => number | null) ) : T[] {
		return items.sort((a, b) => {
			const valueA = mapToField(a);
			const valueB = mapToField(b);

			if (valueA === null || valueA === '') {
				return 1;
			}
			if (valueB === null || valueB === '') {
				return -1;
			}

			// Special case: if both values are integers do an integer comparison instead of a string comparison.
			// First check if the values are valid positive integers
			const aIsValidInt = (typeof valueA) == 'string' ? /^\d+$/.test(valueA as string) : true;
			const bIsValidInt = (typeof valueB) == 'string' ? /^\d+$/.test(valueB as string) : true;

			if(aIsValidInt && !bIsValidInt){
				return -1; // Only first value is valid integer
			} else if (!aIsValidInt && bIsValidInt){
				return 1;  // Only second value is valid integer
			} else if (aIsValidInt && bIsValidInt){
				// Both values are valid integers -> do numeric comparison
				const a1 = (typeof valueA) == 'number' ? valueA as number : parseInt(valueA.toString(), 10);
				const b1 = (typeof valueB) == 'number' ? valueB as number: parseInt(valueB.toString(), 10);
				if (a1 < b1) {
					return -1;
				}
				if (a1 > b1) {
					return 1;
				}
				return 0;
			} else {
				const a1 = (valueA as string).toLowerCase();
				const b1 = (valueB as string).toLowerCase();
				if (a1 < b1) {
					return -1;
				}
				if (a1 > b1) {
					return 1;
				}
				return 0;
			}
		});
	}
	public static sortTree<T extends object>(items : T[], mapToSortField : ((item: T) => string | null) | ((item: T) => number | null), getChildren : (n: T) => T[]) : T[] {
		const sortedList = this.sortList(items, mapToSortField);
		sortedList.forEach(item => {
			const children = getChildren(item);
			const sortedTree = this.sortTree(children, mapToSortField, getChildren);
			const copyOfSortedTree = Object.assign([], sortedTree) as T[];
			children.length = 0;
			children.push(...copyOfSortedTree);
		});
		return sortedList;
	}
	public static addPrefixToKeys<T, O extends { readonly [key in keyof Partial<T>]: IConcreteEntitySchemaProperty }>(properties: O, prefix : string) : O {
		if(properties === undefined || properties === null){
			return properties;
		}
		const renamed : Map<string, IConcreteEntitySchemaProperty> = new Map;
		Object.entries(properties).forEach(([key, value]) => renamed.set(prefix + '.' + key, value as IConcreteEntitySchemaProperty));
		return Object.fromEntries(renamed) as O;
	}
	/**
	 * Return all successors of the item
	 */
	public static getParentItems<T extends IEntityIdentification>(item: T, mainItemList: T[], getParentId : ((n: T) => IEntityIdentification | null) | ((n: T) => number | null)) : T[]{
		const parentId = this.reMapGetParentId(getParentId)(item);
		if(parentId !== null && mainItemList.length > 0){
			const pItem = mainItemList.find(it => this.comparer.compare(it, parentId) === 0);
			if(pItem !== undefined){
				return [pItem, ...this.getParentItems(pItem, mainItemList, getParentId)];
			} else {
				throw new Error('You may not land here: mainItemList, passed as parameter, is not complete');
			}
		} else {
			return [];
		}
	}
	public static buildUpTree<T extends IEntityIdentification>(mainItemList: T[], getParentId : ((n: T) => IEntityIdentification | null) | ((n: T) => number | null), getChildren : (it: T) => T[]) : void{
		mainItemList.forEach(
			it => {
				getChildren(it).push(...mainItemList.
					filter(i => this.comparer.compare(this.reMapGetParentId(getParentId)(i), it) === 0));
			}
		);
	}
}