/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IGridTreeConfiguration } from '@libs/ui/common';

/**
 * Tree data helper
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedTreeDataHelperService {

	/**
	 * Flatten tree array
	 * @param treeArray
	 * @param childrenGetter
	 */
	public flatTreeArray<T>(treeArray: T[], childrenGetter: (e: T) => T[] | null | undefined): T[] {
		let flatArray: T[] = [];

		treeArray.forEach(e => {
			flatArray.push(e);

			const children = childrenGetter(e);

			if (children && children.length > 0) {
				flatArray = flatArray.concat(this.flatTreeArray(children, childrenGetter));
			}
		});

		return flatArray;
	}

	/**
	 * Make grid tree configuration of flat array
	 * @param flatArrayGetter
	 * @param idGetter
	 * @param parentGetter
	 */
	public makeGridTreeConfigOfFlatArray<T extends object>(flatArrayGetter: () => T[], idGetter: (e: T) => number, parentGetter: (e: T) => number | null | undefined): IGridTreeConfiguration<T> {
		return {
			parent: (entity) => {
				const flatArray = flatArrayGetter();
				if (parentGetter(entity)) {
					return flatArray.find(item => idGetter(item) === parentGetter(entity)) || null;
				}
				return null;
			},
			children: (entity) => {
				const flatArray = flatArrayGetter();
				return flatArray.reduce((result: T[], item) => {
					if (idGetter(entity) === parentGetter(item)) {
						result.push(item);
					}
					return result;
				}, []) || [];
			}
		};
	}
}