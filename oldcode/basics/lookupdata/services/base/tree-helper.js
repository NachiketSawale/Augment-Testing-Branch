/**
 * Created by wui on 2/5/2015.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsLookupdataTreeHelper',['_', 'platformObjectHelper',
		
		function(_, platformObjectHelper){
			
			return {
				buildTree: buildTree,
				filterTree: filterTree,
				findNode: findNode,
				flatten: flatten
			};

			/**
			 * @description: construct tree relation if it is tree view.
			 */
			/* jshint -W083 */ // just follow Array api.
			function buildTree(list, context) {
				var treeOptions = context.treeOptions,
					IdProperty = context.IdProperty;
					
				if (!angular.isArray(list)) { // not array list.
					return [];
				}

				if (angular.isArray(list) && !list.length) { // array list length zero.
					return list;
				}

				if (!treeOptions) { // not tree view.
					return list;
				}

				// don't influence original list array.
				list = list.map(function(item){
					return item;
				});

				var index = 0;
				var tops = []; // collect roots whose parent is is not null.
				var roots = buildNode(null, list, context); // consider items whose parent id is null as root node.

				// collect top items.
				while (index < list.length) {
					var hasParent = list.some(function (innerItem) {
						return platformObjectHelper.getValue(innerItem, IdProperty) === platformObjectHelper.getValue(list[index], treeOptions.parentProp);
					});

					if (hasParent) {
						index++;
					}
					else {
						tops.push(list.splice(index, 1)[0]);
					}
				}

				// concat top items.
				if (tops.length > 0) {
					tops.forEach(function (item) {
						buildNode(item, list, context);
					});
					roots = roots.concat(tops);
				}

				return roots;
			}

			/**
			 * @description: build tree relation for each node.
			 */
			function buildNode(targetItem, list, context) { /* jshint -W074 */ // cyclomatic complexity is too high.
				if (!angular.isArray(list) || list.length === 0) {
					return;
				}

				var treeOptions = context.treeOptions,
					IdProperty = context.IdProperty,
					children = [];

				if(!_.isNil(targetItem)) {
					children = platformObjectHelper.getValue(targetItem, treeOptions.childProp, null);

					if (!angular.isArray(children)) {
						children = [];
						// assign children nodes.
						platformObjectHelper.setValue(targetItem, treeOptions.childProp, children);
					}
				}

				var index = 0;
				var parentId = null;
				var id = targetItem ? platformObjectHelper.getValue(targetItem, IdProperty) : null;
				var child = null;

				while (index < list.length) {
					parentId = platformObjectHelper.getValue(list[index], treeOptions.parentProp);
					if (parentId === id) {
						// remove current item from list.
						child = list.splice(index, 1)[0];

						// in case children already has a item with same id (bad data)
						if (!children.some(function (item) {
							return platformObjectHelper.getValue(item, IdProperty, null) === platformObjectHelper.getValue(child, IdProperty, null);
						})) {
							children.push(child);
						}
					}
					else {
						index++;
					}
				}

				// build tree for children nodes.
				children.forEach(function (item) {
					buildNode(item, list, context);
				});

				return children;
			}

			/**
			 * @description: .
			 */
			function filterTree(list, context) {
				var matchTree = [];
				var matchList = [];

				if (angular.isArray(list) && list.length > 0) {
					var copyList = angular.copy(list);
					for (var i = 0; i < copyList.length; i++) {
						if (filterNode(copyList[i], matchList, context)) {
							matchTree.push(copyList[i]);
						}
					}
				}

				return {
					matchTree: matchTree,
					matchList: matchList
				};
			}

			/**
			 * @description: judge each data item in items source satisfy specific condition,
			 *  for tree view, if child satisfy condition then its parent should be visible.
			 * @arguments:
			 *  dataItem: data object in items source.
			 *  matchedList: an array to collect items which satisfy specific condition.
			 *  judgeFn: an function which return a boolean value, it will be used to check each item whether satisfy specific condition.
			 */
			function filterNode(dataItem, matchedList, context) {
				var treeOptions = context.treeOptions;
				var judgeFn = context.judgeFn;
				var isVisible = false;
				var isChildVisible = false;
				var visibleChildList = [];
				var tempItem = null;

				if (!treeOptions) {
					return isVisible;
				}

				var childList = platformObjectHelper.getValue(dataItem, treeOptions.childProp);

				if (childList && childList.length > 0) {
					for (var i = 0; i < childList.length; i++) {
						tempItem = angular.copy(childList[i]);
						isChildVisible = filterNode(tempItem, matchedList, context);
						isVisible = isVisible || isChildVisible;

						if (isChildVisible) {
							visibleChildList.push(tempItem);
						}
					}
				}

				platformObjectHelper.setValue(dataItem, treeOptions.childProp, visibleChildList);

				var isMatch = judgeFn(dataItem);

				isVisible = isVisible || isMatch;

				// identify the item which matches search string actually in tree view.
				if (isMatch && matchedList) {
					dataItem.isMatched = true;
					matchedList.push(dataItem);
				}

				return isVisible;
			}

			/**
			 * @description: .
			 */
			function findNode(list, context) {
				if (!angular.isArray(list)) {
					return;
				}

				var queue = [], resultNode = null,
					treeOptions = context.treeOptions,
					judgeFn = context.judgeFn;

				list.forEach(function (dataItem) {
					queue.push(dataItem);
				});

				/* jshint -W083 */ // just follow Array api.
				while (queue.length > 0) {
					var testNode = queue.shift();
					if (judgeFn(testNode)) {
						resultNode = testNode;
						break;
					}
					var childList = platformObjectHelper.getValue(testNode, treeOptions.childProp);
					if (angular.isArray(childList)) {
						childList.forEach(function (item) {
							queue.push(item);
						});
					}
				}

				return resultNode;
			}

			/**
			 * flatten tree array to list array.
			 * @param tree
			 * @param context
			 * @returns {Array}
			 */
			function flatten(tree, context) {
				var treeOptions = context.treeOptions,
					queue = [], list = [],
					pushNode = function (node) {
						queue.push(node);
					};

				tree.forEach(pushNode);
				while (queue.length > 0) {
					var first = queue.shift(),
						children = platformObjectHelper.getValue(first, treeOptions.childProp);
					list.push(first);
					if (angular.isArray(children)) {
						children.forEach(pushNode);
					}
				}

				return list;
			}

		}
		
	]);
	

})(angular);