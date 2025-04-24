(function (angular) {
	'use strict';
	/**
     * @ngdoc service
     * @name basicsTreeDragDropService
     * @function
     *
     * @description
     * basicsTreeDragDropService is the data service for all drag and drop related functionality.
     */
	var moduleName = 'basics.site';
	var siteModule = angular.module(moduleName);
	siteModule.service('basicsTreeDragDropService', basicsTreeDragDropService);

	basicsTreeDragDropService.$inject = ['platformDataServiceDataProcessorExtension'];

	function basicsTreeDragDropService(platformDataServiceDataProcessorExtension) {

		var service = {};
		var isLivePropertyName = 'IsLive';

		service.update = function (container, precondition) {

			var PARENT_PROP = container.data.treePresOpt.parentProp;
			var CHILD_PROP = container.data.treePresOpt.childProp;

			var service = container.service;

			/**
			 * @ngdoc function
			 * @name
			 * @function isLivePreCondition
			 * @methodOf service
			 * @description Not allow to move disable item to enable item
			 * @param {}
			 * @param {}
			 * @returns {}
			 */
			function isLivePreCondition(itemToMove, newParent) {
				return !(itemToMove[isLivePropertyName] === true && newParent[isLivePropertyName] === false);
			}

			service.canUpgrade = function canUpgradeSite() {
				var result = false;

				var itemToMove = service.getSelected();
				if (itemToMove && itemToMove.Id) {
					var parentFk = itemToMove[PARENT_PROP];
					if (parentFk) {
						result = true;
					}
				}
				return result;
			};

			service.upgrade = function upgradeSite() {
				var itemToMove = service.getSelected();

				if (itemToMove && itemToMove.Id) {
					var parentFk = itemToMove[PARENT_PROP];
					if (parentFk) {
						var oldParent = service.getItemById(parentFk);
						var destination = service.getItemById(oldParent[PARENT_PROP]);

						if (destination && destination.Id) {
							itemToMove[PARENT_PROP] = oldParent[PARENT_PROP];
							insertAfter(destination.ChildItems, itemToMove, oldParent);

							_.remove(oldParent[CHILD_PROP], function (treeItem) {
								return treeItem.Id === itemToMove.Id;
							});
						} else {
							itemToMove[PARENT_PROP] = null;
							insertAfter(service.getTree(), itemToMove, oldParent);

							_.remove(oldParent[CHILD_PROP], function (treeItem) {
								return treeItem.Id === itemToMove.Id;
							});
						}
						container.data.markItemAsModified(itemToMove, container.data);

						refreshTree(itemToMove);
					}
				}
			};

			service.canDowngrade = function canDownSite() {
				var result = false;

				var itemToMove = service.getSelected();
				if (itemToMove && itemToMove.Id) {
					var oldParent;
					var sites;
					if (itemToMove[PARENT_PROP]) {
						oldParent = service.getItemById(itemToMove[PARENT_PROP]);
						sites = oldParent.ChildItems;
					} else {
						sites = service.getTree();
					}

					var index = sites.indexOf(itemToMove);
					var newParent;
					if (index > 0) {
						newParent = sites[index - 1];
					}

					if (newParent && newParent.Id) {
						result = true;
					}
					if (result) {
						result = isLivePreCondition(itemToMove,newParent);
					}
					if (result && precondition) {
						result = precondition(itemToMove, newParent);
					}
				}

				return result;
			};

			service.downgrade = function downgradeSite() {
				var itemToMove = service.getSelected();

				if (itemToMove && itemToMove.Id) {
					var oldParent;
					var sites;

					if (itemToMove[PARENT_PROP]) {
						oldParent = service.getItemById(itemToMove[PARENT_PROP]);
						sites = oldParent.ChildItems;
					} else {
						sites = service.getTree();
					}

					var index = sites.indexOf(itemToMove);
					var newParent;
					if (index > 0) {
						newParent = sites[index - 1];
					}

					if (newParent && newParent.Id) {
						newParent.ChildItems.push(itemToMove);
						itemToMove[PARENT_PROP] = newParent.Id;

						if (oldParent) {
							_.remove(oldParent[CHILD_PROP], function (treeItem) {
								return treeItem.Id === itemToMove.Id;
							});
						} else {
							_.remove(service.getTree(), function (treeItem) {
								return treeItem.Id === itemToMove.Id;
							});
						}

						container.data.markItemAsModified(itemToMove, container.data);

						refreshTree(itemToMove);
					}
				}
			};

			service.canMove = function (itemToMove, targetItem) {
				var canMove = true;

				if (itemToMove && itemToMove.Id && targetItem && targetItem.Id) {
					if (itemToMove.Id === targetItem.Id) {
						canMove = false;
					}
					else if (itemToMove[PARENT_PROP] === targetItem.Id) {
						canMove = false;
					} else {
						var currentItem = targetItem;
						while (currentItem[PARENT_PROP]) {
							currentItem = service.getItemById(currentItem[PARENT_PROP]);
							if (currentItem && itemToMove.Id === currentItem.Id) {
								canMove = false;
								break;
							}
						}
					}
				} else {
					canMove = false;
				}
				if (canMove) {
					canMove = isLivePreCondition(itemToMove,targetItem);
				}
				if (canMove && precondition) {
					canMove = precondition(itemToMove, targetItem);
				}
				return canMove;
			};

			service.move = function (itemToMove, targetItem) {
				if (itemToMove && itemToMove.Id && targetItem && targetItem.Id) {
					var oldParent;
					if (itemToMove[PARENT_PROP]) {
						oldParent = service.getItemById(itemToMove[PARENT_PROP]);
					}

					targetItem.ChildItems.push(itemToMove);
					itemToMove[PARENT_PROP] = targetItem.Id;

					if (oldParent) {
						_.remove(oldParent[CHILD_PROP], function (treeItem) {
							return treeItem.Id === itemToMove.Id;
						});
					} else {
						_.remove(service.getTree(), function (treeItem) {
							return treeItem.Id === itemToMove.Id;
						});
					}

					container.data.markItemAsModified(itemToMove, container.data);

					refreshTree(itemToMove);
				}
			};

			function refreshNodeInfo(itemsList, level) {
				var nodeLevel = level ? level : 0;

				_.each(itemsList, function (item) {
					item.nodeInfo = item.nodeInfo ? item.nodeInfo : {};
					item.nodeInfo.level = _.clone(nodeLevel);

					if (!_.isEmpty(item[CHILD_PROP])) {
						item.nodeInfo.children = true;
						item.hasChildren = true;
						item.nodeInfo.isLastItem = false;
						refreshNodeInfo(item[CHILD_PROP], nodeLevel + 1);
					} else {
						item.nodeInfo.children = false;
						item.hasChildren = false;
					}

					platformDataServiceDataProcessorExtension.doProcessItem(item, container.data);
				});
			}

			function insertAfter(list, item, referenceItem) {
				if (_.isArray(list)) {
					var index = list.indexOf(referenceItem);
					if (index >= 0) {
						list.splice(index + 1, 0, item);
					}
				}
			}

			function refreshTree(selectedItem) {
				refreshNodeInfo(service.getTree());
				service.gridRefresh();
				service.deselect({}).then(function () {
					service.setSelected(selectedItem);
				});
			}
		};

		return service;
	}
})(angular);
