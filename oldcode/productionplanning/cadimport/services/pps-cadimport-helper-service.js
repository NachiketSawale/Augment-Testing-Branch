(function () {
	'use strict';
	/*global angular, globals*/

	var moduleName = 'productionplanning.cadimport';
	var module = angular.module(moduleName);
	module.factory('ppsCadImportHelperService', [
		function () {
			function flatten(input, output, childProp) {
				_.forEach(input, function (item) {
					output.push(item);
					if (item[childProp] && item[childProp].length > 0) {
						flatten(item[childProp], output, childProp);
					}
				});
				return output;
			}

			//Drawing = 1, Stack = 2, Template = 3, Stack_Template = 4,
			// Drawing_Doc = 5, Template_Doc = 6, Templates = 7, Stacks = 8, Docs = 9
			function isDrawing(item) {
				return _.includes([1], item.EntityType);
			}

			function isFolder(item) {
				return _.includes([7, 8, 9], item.EntityType);
			}

			function isStackInfo(item) {
				return _.includes([2, 4], item.EntityType);
			}

			function isDoc(item) {
				return isDrawingDoc(item) || isTemplateDoc(item);
			}

			function isDrawingDoc(item) {
				return _.includes([5], item.EntityType);
			}

			function isTemplateDoc(item) {
				return _.includes([6], item.EntityType);
			}

			function isNewTemplate(item) {
				return !!item.IsNewTemplate;
			}

			function isTemplate(item) {
				return _.includes([3], item.EntityType);
			}

			function isNewStack(item) {
				return item.IsNewStack;
			}

			function updateSelection(importModel, treeList) {
				var dataList = [];
				flatten(treeList, dataList, 'ChildItems');
				switch (importModel) {
					case 4://Update_Template_All
						_.forEach(dataList, function (item) {
							item.IsChecked = isDrawing(item) || !isFolder(item);
						});
						break;
					case 5://Update_Template_Not_InProduction
						_.forEach(dataList, function (item) {
							item.IsChecked = isDrawing(item) || isDrawingDoc(item) || (!isFolder(item) && !item.InProduction);
						});
						break;
					case 6://Update_Template_New
						_.forEach(dataList, function (item) {
							item.IsChecked = isDrawing(item) || isDrawingDoc(item) || (isNewTemplate(item) && !isFolder(item));
						});
						break;
					case 7://Update_Template_NewStack
						_.forEach(dataList, function (item) {
							item.IsChecked = isDrawing(item) || isDrawingDoc(item) || (isNewStack(item) && !isFolder(item));
						});
						break;
					case 8://Update_Doc
						_.forEach(dataList, function (item) {
							if (isDrawingDoc(item)) {
								item.IsChecked = true;
							} else if (isTemplateDoc(item)) {
								var template = _.find(dataList, {Id: item.ParentFk});
								item.IsChecked = !isNewTemplate(template);
							} else {
								item.IsChecked = isDrawing(item);
							}
						});
						break;
					case 9://Custom
						break;
				}
			}

			function updateFolderLevel(treeList) {
				if (!treeList) {
					return;
				}
				_.forEach(treeList, function (item) {
					if (isFolder(item)) {
						item.IsChecked = anyChecked(item.ChildItems);
					} else {
						updateFolderLevel(item.ChildItems);
					}
				});
			}

			function anyChecked(treeList) {
				if (_.some(treeList, {IsChecked: true})) {
					return true;
				} else {
					return _.some(treeList, function (child) {
						return anyChecked(child.ChildItems);
					});
				}
			}

			function cascadeCheck(item) {
				if (item) {
					_.forEach(item.ChildItems, function (child) {
						child.IsChecked = item.IsChecked;
						cascadeCheck(child);
					});
				}
			}

			/**
			 * refreshs the nodeInfo Objects and the hasChildren flag of an item
			 * @param itemsList
			 * @param level
			 */
			function refreshNodeInfo(itemsList, level, collapsed, childProp) {
				collapsed = collapsed || false;
				childProp = childProp || 'ChildItems';
				var nodeLevel = level ? level : 0;
				_.each(itemsList, function (item) {
					// set the item level
					item.nodeInfo = item.nodeInfo ? item.nodeInfo : {};
					item.nodeInfo.level = _.clone(nodeLevel);
					item.nodeInfo.collapsed = collapsed;
					// set the nodeInfo
					if (!_.isEmpty(item[childProp])) {
						item.nodeInfo.children = true;
						item.HasChildren = true;
						item.nodeInfo.isLastItem = false;
						refreshNodeInfo(item[childProp], nodeLevel + 1);
					} else {
						item.nodeInfo.children = false;
						item.HasChildren = false;
						item.nodeInfo.collapsed = collapsed;
					}
				});
			}

			return {
				flatten: flatten,
				isFolder: isFolder,
				isDoc: isDoc,
				isNewTemplate: isNewTemplate,
				updateSelection: updateSelection,
				updateFolderLevel: updateFolderLevel,
				anyChecked: anyChecked,
				cascadeCheck: cascadeCheck,
				refreshNodeInfo: refreshNodeInfo,
				isTemplate: isTemplate
			};
		}
	]);
})();