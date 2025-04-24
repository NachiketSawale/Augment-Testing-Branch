/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import {
	IEstimateCreationData
} from '@libs/estimate/interfaces';

@Injectable({
	providedIn: 'root',
})

/**
 * @name estimateMainGenerateSortingService
 *
 * @description
 * creates instances of creation services to:
 * - manages several processors which can be used to process an item.
 */
export class EstimateMainGenerateSortingService {
	/**
	 * Generate sorting number for a new item.
	 * @param selectedItem The selected item.
	 * @param itemList The list of items.
	 * @param creationData The creation data for the new item.
	 * @returns The generated sorting number.
	 */

	public generateSorting(selectedItem: IEstResourceEntity, itemList: IEstResourceEntity[], creationData: IEstimateCreationData): number {
		let generatedSortNo = 0;
		let parentSortNo = 0;
		const parentId = creationData.parentId;
		const increment: number = 1;

		if (parentId) {
			const parentItem = itemList.find((item) => item.Id === parentId);
			parentSortNo = parentItem ? parentItem.Sorting : -1;
		}
		// in case of new create item
		if (selectedItem) {
			if (parentId) {
				const children = selectedItem.Id === parentId ? itemList.filter((item) => item.EstResourceFk === selectedItem.Id) : itemList.filter((item) => item.EstResourceFk === parentId);

				if (children && children.length) {
					generatedSortNo = this.getLastSortNo(children) + increment;
				} else {
					generatedSortNo = parentSortNo * 10 + increment;
				}
			} else {
				// no parent so root parent
				generatedSortNo = this.getLastParentSortNo(itemList) + 1;
			}
		} else {
			// not selected
			// always parent item...assign last sorting order in list
			generatedSortNo = this.getLastParentSortNo(itemList) + 1;
		}
		return generatedSortNo;
	}

	/**
	 * Get the last sorting number from the given list of items.
	 * @param {IEstResourceEntity[]} itemList - The list of items to search.
	 * @returns {number} The last sorting number found in the list, or 1 if the list is empty.
	 */
	public getLastSortNo(itemList: IEstResourceEntity[]) {
		_.sortBy(itemList, ['Sorting']);
		const lastItem = _.findLast(itemList);
		return lastItem ? lastItem.Sorting : 1;
	}

	/**
	 * Get the last parent sorting number from the given list of items.
	 * @param {IEstResourceEntity[]} itemList - The list of items to search.
	 * @returns {number} The last parent sorting number found in the list, or 0 if no such item is found.
	 */

	public getLastParentSortNo(itemList: IEstResourceEntity[]) {
		const filteredItems = _.filter(itemList, function (item) {
			return item.EstResourceFk === null;
		});

		// Find the item with the maximum 'Sorting' value  the filtered items
		const maxSortingItem = _.maxBy(filteredItems, 'Sorting');

		// Return the maximum 'Sorting' value or 0 if no such item is found
		return maxSortingItem ? maxSortingItem.Sorting : 0;
	}

	/**
	 * Sorts items on drag and drop based on the destination item.
	 * @param {IEstResourceEntity} destinationItem - The destination item where the dragged item is dropped.
	 * @param {IEstResourceEntity[]} itemList - The list of all items.
	 * @param {IEstResourceEntity} itemToMove - The item being dragged and dropped.
	 * @returns {IEstResourceEntity[]} The sorted list of items after drag and drop operation.
	 */

	public sortOnDragDrop(destinationItem: IEstResourceEntity, itemList: IEstResourceEntity[], itemToMove: IEstResourceEntity) {
		if (!itemToMove) {
			return;
		}
		const itemToMov = itemList.find((item) => item.Id === itemToMove.Id);
		itemList = _.sortBy(itemList, ['Sorting']);
		const increment = 1;

		if (destinationItem) {
			if (destinationItem.EstResourceTypeFk === 5) {
				const children = itemList.filter((item) => item.EstResourceFk === destinationItem.Id);
				const itemToMov = itemList.find((item) => item.Id === itemToMove.Id);
				const parentSortNo = destinationItem.Sorting;

				if (itemToMov) {
					// itemToMov.Sorting = lastNo;
					if (children && children.length) {
						itemToMov.Sorting = this.getLastSortNo(children) + increment;
					} else {
						itemToMov.Sorting = parentSortNo * 10 + increment;
					}
					itemToMov.EstResourceFk = destinationItem.Id;
				}
			} else {
				// set itemToMove after destinationItem in list
				let prevSortNo = destinationItem.Sorting ? destinationItem.Sorting : 1;

				if (itemToMov) {
					itemToMov.Sorting = prevSortNo + increment;
					itemToMov.EstResourceFk = destinationItem.EstResourceFk;

					// get index of destination item and fetch all item after tht for renumber
					const startIndex = _.findIndex(itemList, destinationItem);
					prevSortNo = itemToMov.Sorting;
					for (let i = startIndex + 1; i <= itemList.length - 1; i++) {
						const nextItem = itemList[i];
						if (nextItem && nextItem.EstResourceFk === destinationItem.EstResourceFk && nextItem.Id !== itemToMove.Id) {
							nextItem.Sorting = prevSortNo + increment;
							prevSortNo = nextItem.Sorting;
						}
					}
				}
			}
		} else {
			let lastItem = null;
			for (let i = itemList.length - 1; i >= 0; i--) {
				const currentItem = itemList[i];
				itemToMove.EstResourceFk = null;
				if (currentItem.EstResourceFk === null && currentItem.Id !== itemToMove.Id) {
					lastItem = currentItem;
					break;
				}
			}
			itemToMove.Sorting = lastItem ? lastItem.Sorting + increment : increment;
			itemToMove.EstResourceFk = null;
		}
		return itemList;
	}

	/**
	 * Sorts an array of items based on the Sorting property when an item is edited.
	 * @param itemList An array of items to be sorted.
	 * @param itemToMove The item that triggered the sorting.
	 * @returns The sorted array of items.
	 */
	public sortOnEdit(itemList: IEstResourceEntity[], itemToMove: IEstResourceEntity) {
		if (!itemToMove) {
			return;
		}
		//service.resourceItemModified.fire(itemToMove);    // TODO need to be implemented when resource and line itme container is ready

		const increment = 1;
		let prevSortNo = itemToMove.Sorting ? itemToMove.Sorting : 1;
		let itemsToSort = itemList.filter((item) => {
			return (item.Id !== itemToMove.Id && item.EstResourceFk === itemToMove.EstResourceFk && item.Sorting >= prevSortNo);
		});

		itemsToSort = _.sortBy(itemsToSort, ['Sorting']);
		itemsToSort.forEach((item) => {
			item.Sorting = prevSortNo + increment;
			prevSortNo = item.Sorting;
			this.assignSorting([item], item.Sorting.toString());
			//service.resourceItemModified.fire(item);   // TODO need to be implemented when resource and line itme container is ready
		});
		return itemList;
	}

	/**
	 * Assigns sorting values to an array of objects recursively.
	 * @param objArray - The array of objects to assign sorting values to.
	 * @param sortingPrefix - The prefix for sorting values.
	 * @param isCall - Indicates if the function is being called recursively.
	 * */
	public assignSorting(objArray: IEstResourceEntity[], sortingPrefix: string = '', isCall: boolean = true): void {
		let lastNumber: number = parseInt(sortingPrefix.slice(-3));

		for (let i = 0; i < objArray.length; i++) {
			const itemSortingPrefix: string = isCall ? sortingPrefix : sortingPrefix + (i + 1).toString();

			if (isCall) {
				lastNumber += 1;
				sortingPrefix = sortingPrefix.slice(0, -3) + lastNumber.toString().padStart(2, '0');
			}

			const obj: IEstResourceEntity = objArray[i];
			obj.Sorting = parseInt(itemSortingPrefix);

			if (obj.EstResources && obj.EstResources.length > 0) {
				this.assignSorting(obj.EstResources, itemSortingPrefix, false);
			}
		}
	}

	/**
	 * Sort numbers
	 * @param toSort Array of numbers
	 */
	public sortNumber(toSort: number[]) {
		return toSort.sort((a, b) => {
			return a - b;
		});
	}
}
