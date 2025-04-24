/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IListSelectionDialogUtilityData } from '../model/list-selection-dialog-utility-data.interface';

/**
 * Utility service to handle toolbar operations.
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonListSelectionDialogUtilitiesService {
	/**
	 * Function returns flag if item is movable or not.
	 *
	 * @param { IListSelectionDialogUtilityData } info Toolbar data used to move entity item up/down.
	 * @returns { Boolean } Returns flag if item is movable or not.
	 */
	public canMoveItems(info: IListSelectionDialogUtilityData): boolean {
		const actualIndexesToMove = this.uniq<number>(info.indexesToMove || []);

		if (actualIndexesToMove.length > info.totalCount) {
			throw new Error('Indexes to move exceed bounds.');
		}

		if (actualIndexesToMove.length <= 0) {
			return false;
		}

		actualIndexesToMove.sort();

		const hasGaps = (function () {
			for (let i = 1; i < actualIndexesToMove.length; i++) {
				if (actualIndexesToMove[i] - actualIndexesToMove[i - 1] > 1) {
					return true;
				}
			}
			return false;
		})();

		if (info.delta < 0) {
			return hasGaps || actualIndexesToMove[0] > 0;
		} else if (info.delta > 0) {
			return hasGaps || actualIndexesToMove[actualIndexesToMove.length - 1] < info.totalCount - 1;
		} else {
			return false;
		}
	}

	/**
	 * Function returns flag if item can be moved to top of list.
	 *
	 * @param { IListSelectionDialogUtilityData } info Toolbar data used to move entity item up/down.
	 * @returns { Boolean } Returns flag if item is movable or not.
	 */
	public canMoveItemsToBeginning(info: IListSelectionDialogUtilityData): boolean {
		info.delta = -1;
		return this.canMoveItems(info);
	}

	/**
	 * Function returns flag if item can be moved to bottom of list.
	 *
	 * @param { IListSelectionDialogUtilityData } info Toolbar data used to move entity item up/down.
	 * @returns { Boolean } Returns flag if item is movable or not.
	 */
	public canMoveItemsToEnd(info: IListSelectionDialogUtilityData): boolean {
		info.delta = 1;
		return this.canMoveItems(info);
	}

	/**
	 * Method to move item up and down.
	 *
	 * @param { IListSelectionDialogUtilityData } info Toolbar data used to move entity item up/down.
	 */
	public moveItems(info: IListSelectionDialogUtilityData): void {
		if (info.delta === 0 || info.indexesToMove.length <= 0) {
			return;
		}

		const actualIndexesToMove = this.uniq(info.indexesToMove);
		actualIndexesToMove.sort();

		let lastIdx = 0;

		if (info.delta < 0) {
			lastIdx = -1;
			actualIndexesToMove.forEach((idx) => {
				const newIdx = Math.max(...[idx + info.delta, lastIdx + 1]);
				lastIdx = newIdx;
				if (idx !== newIdx) {
					info.moveItemFunc(idx, newIdx);
				}
			});
		} else {
			lastIdx = info.totalCount;
			actualIndexesToMove.reverse().forEach((idx) => {
				const newIdx = Math.min(...[idx + info.delta, lastIdx - 1]);
				lastIdx = newIdx;
				if (idx !== newIdx) {
					info.moveItemFunc(idx, newIdx);
				}
			});
		}
	}

	/**
	 * Method to move item to top of the list.
	 *
	 * @param { IListSelectionDialogUtilityData } info Toolbar data used to move entity item up/down.
	 */
	public moveItemsToBeginning(info: IListSelectionDialogUtilityData): void {
		if (info.indexesToMove.length <= 0) {
			return;
		}

		const actualIndexesToMove = this.uniq(info.indexesToMove);
		actualIndexesToMove.sort();

		actualIndexesToMove.forEach(function (idxToMove, indexIndex) {
			if (idxToMove !== indexIndex) {
				info.moveItemFunc(idxToMove, indexIndex);
			}
		});
	}

	/**
	 * Method to move item to bottom of the list.
	 *
	 * @param { IListSelectionDialogUtilityData } info Toolbar data used to move entity item up/down.
	 */
	public moveItemsToEnd(info: IListSelectionDialogUtilityData): void {
		if (info.indexesToMove.length <= 0) {
			return;
		}

		const actualIndexesToMove = this.uniq(info.indexesToMove);
		actualIndexesToMove.sort();

		actualIndexesToMove.reverse().forEach((idxToMove, indexIndex) => {
			const newIndex = info.totalCount - 1 - indexIndex;
			if (idxToMove !== newIndex) {
				info.moveItemFunc(idxToMove, newIndex);
			}
		});
	}

	/**
	 * Returns the uniq item list.
	 *
	 * @param { T[] } array Entity list
	 * @returns { T[] } Unique item list.
	 */
	private uniq<T>(array: T[]): T[] {
		return [...new Set(array)];
	}
}
