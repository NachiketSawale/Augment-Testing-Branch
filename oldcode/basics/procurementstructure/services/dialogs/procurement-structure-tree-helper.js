/**
 * Created by wui on 12/23/2014.
 */

(function(angular){ /* jshint -W083 */ // don't make function within a loop
	'use strict';

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('basicsProcurementstructureTreeHelper',['platformObjectHelper',
		function(platformObjectHelper) {

			return {
				map: map,
				merge: merge,
				match: match,
				filter: filter,
				iterate: iterate,
				removeNode: removeNode,
				setChildCount: setChildCount
			};

			/**
			 * @description map tree structure data of one data type to another.
			 * @param sourceTree
			 * @param treeInfo
			 * @param mapFn
			 * @returns {Array}
			 */
			function map(sourceTree, treeInfo, mapFn) {
				var newTree = [];
				var childProp = treeInfo.childProp;

				var itemMap = function (nodeItem) {
					if (!nodeItem) {
						return;
					}

					var newItem = mapFn(nodeItem);
					var childItems = platformObjectHelper.getValue(nodeItem, childProp);

					if (angular.isArray(childItems) && childItems.length > 0) {
						var newChildItems = [];

						platformObjectHelper.setValue(newItem, childProp, newChildItems);
						newItem.HasChildren = true;

						childItems.forEach(function (item) {
							newChildItems.push(itemMap(item));
						});
					}else {//fix that when childItems is null or empty the newItem's prcStructure missing be processed.
						platformObjectHelper.setValue(newItem, childProp, []);
						newItem.HasChildren = true;
					}

					return newItem;
				};

				sourceTree.forEach(function (rootItem) {
					newTree.push(itemMap(rootItem));
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
			function merge(targetTree, sourceTree, treeInfo, equalFn) {
				if (!angular.isArray(targetTree) || !angular.isArray(sourceTree)) {
					return;
				}

				var childProp = treeInfo.childProp;
				var parentProp = treeInfo.parentProp;
				var idProp = treeInfo.idProp;
				var pushById = function(arr, item) {
					var isSuccess = false;
					var sameItem = arr.filter(function (oldItem) {
						return equalFn(oldItem, item);
					});

					if (sameItem.length === 0) {
						arr.push(item);
						isSuccess = true;
					}

					return isSuccess;
				};
				var pushChildItems = function(sourceItem){
					var childItems = platformObjectHelper.getValue(sourceItem, childProp);

					if (angular.isArray(childItems)) {
						childItems.forEach(function (child) {
							sourceTree.push(child);
						});
					}
				};
				var insert = function (targetItem, sourceItem) {
					var isSuccess = false;
					var targetId = platformObjectHelper.getValue(targetItem, idProp);
					var sourcePId = platformObjectHelper.getValue(sourceItem, parentProp);
					var childItems = platformObjectHelper.getValue(targetItem, childProp);

					if (targetId === sourcePId) {
						if (!angular.isArray(childItems)) {
							childItems = [];
							platformObjectHelper.setValue(targetItem, childProp, childItems);
						}
						targetItem.HasChildren = true;
						isSuccess = pushById(childItems, sourceItem);
					}
					else if (angular.isArray(childItems)) {
						childItems.forEach(function (childItem) {
							insert(childItem, sourceItem);
						});
					}

					return isSuccess;
				};

				while (sourceTree.length > 0) {
					var sourceItem = sourceTree.shift();
					var parentId = platformObjectHelper.getValue(sourceItem, parentProp);

					if (parentId === null) {
						if (!pushById(targetTree, sourceItem)) {
							pushChildItems(sourceItem);
						}
					}
					else {
						//TODO: code optimize?
						targetTree.forEach(function (targetItem) {
							if(!insert(targetItem, sourceItem)) {
								pushChildItems(sourceItem);
							}
						});
					}
				}
			}

			/**
			 * @param sourceTree
			 * @param treeInfo
			 * @param matchFn
			 * @returns {Array}
			 */
			function match(sourceTree, treeInfo, matchFn) {
				if (!angular.isArray(sourceTree)) {
					return null;
				}

				var childProp = treeInfo.childProp;
				var result = null;
				var queue = [];

				sourceTree.forEach(function (item) {
					queue.push(item);
				});

				while (queue.length > 0) {
					var dataItem = queue.shift();

					if (matchFn(dataItem)) {
						result = dataItem;
						break;
					}

					var childItems = platformObjectHelper.getValue(dataItem, childProp);

					if (angular.isArray(childItems)) {
						childItems.forEach(function (child) {
							queue.push(child);
						});
					}
				}

				return result;
			}

			/**
			 * @description filter data and return a plain items which satisfy filter.
			 * @param sourceTree
			 * @param treeInfo
			 * @param filterFn
			 * @returns {Array}
			 */
			function filter(sourceTree, treeInfo, filterFn){
				if (!angular.isArray(sourceTree)) {
					return null;
				}

				var childProp = treeInfo.childProp;
				var result = [];
				var queue = [];

				sourceTree.forEach(function (item) {
					queue.push(item);
				});

				while (queue.length > 0) {
					var dataItem = queue.shift();

					if (filterFn(dataItem)) {
						result.push(dataItem);
					}

					var childItems = platformObjectHelper.getValue(dataItem, childProp);

					if (angular.isArray(childItems)) {
						childItems.forEach(function (child) {
							queue.push(child);
						});
					}
				}

				return result;
			}

			/**
			 * @description iterate tree data to process each item.
			 * @param sourceTree
			 * @param treeInfo
			 * @param handleFn
			 */
			function iterate(sourceTree, treeInfo, handleFn) {
				var childProp = treeInfo.childProp;
				var doIteration = function (nodeItem) {
					if (!nodeItem) {
						return;
					}

					handleFn(nodeItem);

					var childItems = platformObjectHelper.getValue(nodeItem, childProp);
					if (angular.isArray(childItems) && childItems.length > 0) {
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
			 * @param node
			 */
			function removeNode(sourceTree, treeInfo, node) {
				var isSuccess = false;
				var targetArr = sourceTree;
				var childProp = treeInfo.childProp;
				var parentProp = treeInfo.parentProp;
				var parent = match(sourceTree, treeInfo, function (nodeItem) {
					return nodeItem.Id === platformObjectHelper.getValue(node, parentProp);
				});

				if (parent) {
					targetArr = platformObjectHelper.getValue(parent, childProp);
				}

				if (angular.isArray(targetArr)) {
					for (var i = 0; i < targetArr.length; i++) {
						if (targetArr[i] === node) {
							if (targetArr.splice(i, 1).length > 0) {
								isSuccess = true;
							}
							break;
						}
					}
				}

				return isSuccess;
			}

			/**
			 * @param sourceTree
			 * @param treeInfo
			 * @param isValidFn
			 * @returns {Array}
			 */
			function setChildCount(sourceTree, treeInfo, isValidFn) {
				var childProp = treeInfo.childProp;
				var count = function (nodeItem) {
					var length = 0;
					var childItems = platformObjectHelper.getValue(nodeItem, childProp);

					if (angular.isArray(childItems)) {
						childItems.forEach(function (childItem) {
							if(isValidFn(childItem)) {
								length = length + 1;
							}
							length = length + count(childItem);
						});
					}

					nodeItem.ChildCount = length;

					return length;
				};

				sourceTree.forEach(function (rootItem) {
					count(rootItem);
				});
			}

		}
	]);

})(angular);