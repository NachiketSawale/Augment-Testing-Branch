/*
 * Copyright(c) RIB Software GmbH
 */

import {PrcStructureLookupEntity} from '@libs/basics/shared';
import * as _ from 'lodash';
import {TreeInfo} from '../types/TreeInfo';
import { IBusinessPartner2PrcStructureEntity } from '@libs/businesspartner/interfaces';

export class ProcurementStructureTreeHelper {
	/**
	 * @description map tree structure data of one data type to another.
	 * @param sourceTree
	 * @param treeInfo
	 * @param mapFn
	 * @returns {Array}
	 */
	public static map(sourceTree: IBusinessPartner2PrcStructureEntity[], treeInfo: TreeInfo,
					  mapFn: (oldItem: IBusinessPartner2PrcStructureEntity) => PrcStructureLookupEntity | null | undefined) {
		const newTree: PrcStructureLookupEntity[] = [];
		const childProp: string = treeInfo.childProp ?? '';

		const itemMap = function (nodeItem: IBusinessPartner2PrcStructureEntity) {
			if (!nodeItem) {
				return null;
			}

			const newItem = mapFn(nodeItem);
			if (!newItem) {
				return null;
			}
			const childItems: IBusinessPartner2PrcStructureEntity[] = _.get(nodeItem, childProp, []) as IBusinessPartner2PrcStructureEntity[];

			if (Array.isArray(childItems) && childItems.length > 0) {
				const newChildItems: PrcStructureLookupEntity[] = [];

				_.set(newItem, childProp, newChildItems);
				newItem.HasChildren = true;

				childItems.forEach(function (item) {
					const temp = itemMap(item);
					if (temp) {
						newChildItems.push(temp);
					}
				});
			}else {//fix that when childItems is null or empty the newItem's prcStructure missing be processed.
				_.set(newItem, childProp, []);
				newItem.HasChildren = true;
			}

			return newItem;
		};

		sourceTree.forEach(function (rootItem) {
			const temp = itemMap(rootItem);
			if (temp) {
				newTree.push(temp);
			}
		});

		return newTree;
	}

	/**
	 * @description merge 2 tree structure data with same tree info.
	 * @param targetTree
	 * @param sourceTree
	 * @param treeInfo
	 * @param equalFn
	 */
	public static merge(targetTree: IBusinessPartner2PrcStructureEntity[], sourceTree: IBusinessPartner2PrcStructureEntity[],
						treeInfo: TreeInfo, equalFn: (oldItem: IBusinessPartner2PrcStructureEntity, newItem: IBusinessPartner2PrcStructureEntity) => boolean) {
		if (!Array.isArray(targetTree) || !Array.isArray(sourceTree)) {
			return;
		}

		const childProp: string = treeInfo.childProp ?? '';
		const parentProp: string = treeInfo.parentProp ?? '';
		const idProp: string = treeInfo.idProp ?? '';
		const pushById = function(arr: IBusinessPartner2PrcStructureEntity[], item: IBusinessPartner2PrcStructureEntity) {
			let isSuccess = false;
			const sameItem = arr.filter(function (oldItem) {
				return equalFn(oldItem, item);
			});

			if (sameItem.length === 0) {
				arr.push(item);
				isSuccess = true;
			}

			return isSuccess;
		};
		const pushChildItems = function(sourceItem: IBusinessPartner2PrcStructureEntity){
			const childItems = _.get(sourceItem, childProp, []);

			if (Array.isArray(childItems) && childItems.length === 0) {
				childItems.forEach(function (child) {
					sourceTree.push(child);
				});
			}
		};
		const insert = function (targetItem: IBusinessPartner2PrcStructureEntity, sourceItem: IBusinessPartner2PrcStructureEntity) {
			let isSuccess = false;
			const targetId = _.get(targetItem, idProp);
			const sourcePId = _.get(sourceItem, parentProp);
			let childItems = _.get(targetItem, childProp);

			if (targetId === sourcePId) {
				if (!Array.isArray(childItems)) {
					childItems = [];
					_.set(targetItem, childProp, childItems);
				}
				targetItem.HasChildren = true;
				isSuccess = pushById(childItems, sourceItem);
			} else if (Array.isArray(childItems)) {
				childItems.forEach(function (childItem) {
					insert(childItem, sourceItem);
				});
			}

			return isSuccess;
		};

		while (sourceTree.length > 0) {
			const sourceItem = sourceTree.shift();
			const parentId = _.get(sourceItem, parentProp);

			if (parentId === null) {
				if (sourceItem && !pushById(targetTree, sourceItem)) {
					pushChildItems(sourceItem);
				}
			} else {
				//TODO: code optimize?
				targetTree.forEach(function (targetItem) {
					if(sourceItem && !insert(targetItem, sourceItem)) {
						pushChildItems(sourceItem);
					}
				});
			}
		}
	}

	/**
	 * @description iterate tree data to process each item.
	 * @param sourceTree
	 * @param treeInfo
	 * @param handleFn
	 */
	public static iterate(sourceTree: IBusinessPartner2PrcStructureEntity[], treeInfo: TreeInfo, handleFn: (newItem: IBusinessPartner2PrcStructureEntity) => void) {
		const childProp = treeInfo.childProp ?? '';
		const doIteration = function (nodeItem: IBusinessPartner2PrcStructureEntity) {
			if (!nodeItem) {
				return;
			}

			handleFn(nodeItem);

			const childItems = _.get(nodeItem, childProp);
			if (Array.isArray(childItems) && childItems.length > 0) {
				childItems.forEach(function (item) {
					doIteration(item);
				});
			}
		};

		sourceTree.forEach(function (rootItem) {
			doIteration(rootItem);
		});
	}

	/**
	 * @param sourceTree
	 * @param treeInfo
	 * @param isValidFn
	 * @returns {Array}
	 */
	public static setChildCount(sourceTree: PrcStructureLookupEntity[], treeInfo: TreeInfo, isValidFn: (obj: PrcStructureLookupEntity) => boolean) {
		const childProp = treeInfo.childProp ?? '';
		const countProp = treeInfo.countProp ?? '';
		const count = function (nodeItem: PrcStructureLookupEntity) {
			let length = 0;
			const childItems = _.get(nodeItem, childProp);

			if (Array.isArray(childItems)) {
				childItems.forEach(function (childItem) {
					if(isValidFn(childItem)) {
						length = length + 1;
					}
					length = length + count(childItem);
				});
			}

			_.set(nodeItem, countProp, length);

			return length;
		};

		sourceTree.forEach(function (rootItem) {
			count(rootItem);
		});
	}
}