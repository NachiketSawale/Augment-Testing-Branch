/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceDataPresentExtension
	 * @function
	 * @requires platformDataServiceItemFilterExtension, platformDataServiceDataProcessorExtension, platformDataServiceSelectionExtension, platformDataServiceActionExtension
	 * @description
	 * platformDataServiceDataPresentExtension add behaviour to display data of the data service
	 */
	angular.module('platform').service('platformDataServiceDataPresentExtension', PlatformDataServiceDataPresentExtension);

	PlatformDataServiceDataPresentExtension.$inject = ['_', 'platformDataServiceItemFilterExtension', 'platformDataServiceDataProcessorExtension',
		'platformDataServiceSelectionExtension', 'platformDataServiceActionExtension', 'platformDataValidationService',
		'platformDataServiceEntitySortExtension', 'platformContextService', 'platformDataServiceModificationTrackingExtension'];

	function PlatformDataServiceDataPresentExtension(_, platformDataServiceItemFilterExtension, platformDataServiceDataProcessorExtension,
		platformDataServiceSelectionExtension, platformDataServiceActionExtension, platformDataValidationService,
		platformDataServiceEntitySortExtension, platformContextService, platformDataServiceModificationTrackingExtension) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceSelectionExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this;

		function getFirstEntity(deleteParams) {
			var res = deleteParams.entity || null;
			if (!res && deleteParams.entities && deleteParams.entities.length > 0) {
				res = deleteParams.entities[0];
			}

			return res;
		}

		this.addEntityPresentation = function addEntityPresentation(container, options) {
			if (options.presenter) {
				if (options.presenter.list) {
					self.addEntityListPresenter(container, options.presenter.list);
				} else if (options.presenter.tree) {
					self.addEntityTreePresenter(container, options.presenter.tree);
				}
			}
		};

		this.addBasicPresentationBehaviour = function addBasicPresentationBehaviour(container) {
			container.data.itemList = [];

			container.data.usingContainer = [];

			container.data.getList = function getList() {
				if (container.data.itemFilterEnabled) {
					return platformDataServiceItemFilterExtension.filterList(container.data);
				}

				return container.data.itemList;
			};

			container.data.getUnfilteredList = function getUnfilteredList() {
				return container.data.itemList;
			};

			container.data.setList = function setList(items) {
				var data = container.data;
				// clear current data
				data.doClearModifications(null, data);
				data.selectedItem = null;
				data.itemList.length = 0;
				_.forEach(items, function (item) {
					data.itemList.push(item);
					data.markItemAsModified(item, data);   // set new items as modified
				});

				container.data.listLoaded.fire();
			};

			container.data.addUsingContainer = function addUsingContainer(guid) {
				var needLoad = self.serviceNeedsLoad(container.data);

				if (needLoad || !_.find(container.data.usingContainer, function (id) {
					return id !== guid;
				})) {
					container.data.usingContainer.push(guid);
				}

				if (needLoad && !container.data.selectedItem && !container.data.isRoot && container.data.loadSubItemList) {
					container.data.loadSubItemList();
				}

				if (container.data.translateEntity) {
					container.data.translateEntity(container.data);
				}
			};

			container.data.removeUsingContainer = function removeUsingContainer(guid) {
				container.data.usingContainer = _.filter(container.data.usingContainer, function (id) {
					return id !== guid;
				});
			};

			container.data.hasUsingContainer = function hasUsingContainer(guid) {
				return _.some(container.data.usingContainer, function (id) {
					return id === guid;
				});
			};

			container.data.onReadSucceeded = function () {
			};

			if (!container.data.doCallHTTPRead) {
				container.data.doCallHTTPRead = function () {
				};
			}

			container.service.read = function () {
				return container.data.doReadData(container.data);
			};
			container.service.load = function () {
				return container.data.doReadData(container.data);
			};

			container.service.getLookupData = container.data.getList;
			container.service.getList = container.data.getList;
			container.service.setList = container.data.setList;
			container.service.getUnfilteredList = container.data.getUnfilteredList;

			container.service.addUsingContainer = container.data.addUsingContainer;
			container.service.removeUsingContainer = container.data.removeUsingContainer;
			container.service.hasUsingContainer = container.data.hasUsingContainer;
		};

		this.addListLoadingBehaviour = function addListLoadingBehaviour(container) {
			// Prepare data and provide service interface
			container.data.registerAndCreateEventMessenger('listLoadStarted');
			container.data.registerAndCreateEventMessenger('listLoaded');// The data for the plain list has been loaded successfully (again) -> control shall update
			container.data.registerAndCreateEventMessenger('entitiesAdded');
		};

		this.addEntityListPresenter = function addEntityListPresenter(container, opt) {
			container.data.listPresOpt = opt;

			self.addBasicPresentationBehaviour(container);

			self.addListLoadingBehaviour(container);

			container.data.asFlatList = function provideListItemFlatList(entities) {
				return entities;
			};

			container.data.reduceOwnTreeStructuresInUpdateData = function reduceOwnTreeStructuresInUpdateData(updateData/* , data */) {
				return updateData;
			};

			container.data.handleOnCreateSucceeded = function handleOnCreateSucceededInList(newItem, data) {
				return self.handleOnCreateSucceededInList(newItem, data, container.service);
			};

			container.data.clearContent = function clearListContent(data) {
				if(!data.doNotUnloadOwnOnSelectionChange) {
					data.itemList.length = 0;

					if (data.listLoaded) {
						data.listLoaded.fire();
					}
				}
			};

			container.data.moveItem = function moveItem(entities) {
				var index;
				angular.forEach(entities, function (entity) {
					index = container.data.itemList.indexOf(entity);
					container.data.itemList = _.filter(container.data.itemList, function (item) {
						return item.Id !== entity.Id;
					});
				});
				container.data.listLoaded.fire();
			};

			container.data.doPrepareCreate = function doPrepareCreateInList(data, creationOptions) {
				var creationData = {};

				if (data.listPresOpt.initCreationData) {
					data.listPresOpt.initCreationData(creationData, data, creationOptions);
				} else {
					if (angular.isObject(data.parentService)) {
						creationData.mainItemId = data.parentService.getSelected().Id;
					}
				}

				return creationData;
			};

			container.data.onCreateSucceeded = function onCreateSucceeded(newData, data) {
				var newItem;
				if (opt.handleCreateSucceeded) {
					newItem = opt.handleCreateSucceeded(newData, data);// In case more data is send back from server it can be stripped down to the new item here.
					if (!newItem) {// Fall back, if no value is returned by handleCreateSucceeded
						newItem = newData;
					}
				} else {
					newItem = newData;
				}
				if (data.addEntityToCache) {
					data.addEntityToCache(newItem, data);
				}

				return data.handleOnCreateSucceeded(newItem, data);
			};

			container.data.handleCreateSucceededWithoutSelect = function handleCreateSucceededWithoutSelect(newData, data, service) {
				let newItem;
				if (opt.handleCreateSucceeded) {
					newItem = opt.handleCreateSucceeded(newData, data);// In case more data is send back from server it can be stripped down to the new item here.
					if (!newItem) {// Fall back, if no value is returned by handleCreateSucceeded
						newItem = newData;
					}
				} else {
					newItem = newData;
				}
				if (data.addEntityToCache) {
					data.addEntityToCache(newItem, data);
				}

				platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);
				data.itemList.push(newItem);

				data.entitiesAdded.fire(data, [newItem]);
				if (data.newEntityValidator) {
					data.newEntityValidator.validate(newItem, service);
				}

				data.markItemAsModified(newItem, data);
				return newItem;
			};

			container.data.handleReadSucceeded = function onReadSucceededInList(result, data, notNeedDeselect = false) {
				var items;

				if (result && result.hasOwnProperty('FilterResult') && result.hasOwnProperty('dtos')) {  // must be a filtered dto
					items = result.dtos;
					if (data.isRoot && data.isRealRootForOpenedModule() && data.sidebarSearch) {
						data.clearSidebarFilter(result, data);
					}
				} else {
					items = result || [];
				}

				if (platformDataServiceSelectionExtension.supportSelection(data) && !notNeedDeselect) {
					platformDataServiceSelectionExtension.deselect(data);
				}
				data.itemList.length = 0;

				_.each(items, function iterator(item) {
					data.itemList.push(item);
				});

				platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);

				data.listLoaded.fire(items);

				if (data.isRoot && data.isRealRootForOpenedModule() && platformDataServiceSelectionExtension.supportSelection(data)) {
					if (items.length) {
						platformDataServiceSelectionExtension.doMultiSelect(items[0], [items[0]], data);
					} else {
						platformContextService.setPermissionObjectInfo(null);
					}
				}

				return data.itemList;
			};

			if (opt.incorporateDataRead) {
				container.data.onReadSucceeded = opt.incorporateDataRead;
			} else {
				container.data.onReadSucceeded = container.data.handleReadSucceeded;
			}

			container.data.doPrepareDelete = function doPrepareDeleteInList(deleteParams, data) {
				var entity = getFirstEntity(deleteParams);
				deleteParams.index = entity ? data.itemList.indexOf(entity) : -1;
			};

			container.data.onDeleteDone = function onDeleteDoneInList(deleteParams, data, response) {
				self.handleOnDeleteSucceededInList(deleteParams, data, response);
			};

			container.service.read = function () {
				return container.data.doReadData(container.data);
			};
			container.service.load = function () {
				return container.data.doReadData(container.data);
			};
		};

		this.addEntityTreePresenter = function addEntityTreePresenter(container, opt) {
			container.data.treePresOpt = opt;

			self.addBasicPresentationBehaviour(container);

			container.data.itemTree = [];

			container.data.asFlatList = function provideTreeItemFlatList(entities) {
				var flatten = [];
				container.data.flatten(entities, flatten, container.data.treePresOpt.childProp);

				return _.uniq(flatten);
			};

			container.data.reduceOwnTreeStructuresInUpdateData = function reduceOwnTreeStructuresInUpdateData(updateData, data) {
				if (!data.hasToReduceTreeStructures) {
					return updateData;
				}

				var children = platformDataServiceModificationTrackingExtension.tryGetServiceEntriesFromUpdateData(updateData, data);

				var propName = container.data.treePresOpt.childProp;
				_.forEach(children, function (child) {
					child[propName] = [];
				});

				return children;
			};

			container.data.handleOnCreateSucceeded = function handleOnCreateSucceededInTree(newItem, data) {
				var newItems = [];
				data.flatten([newItem], newItems, data.treePresOpt.childProp);
				_.forEach(newItems, function (item) {
					platformDataServiceDataProcessorExtension.doProcessItem(item, data);
					data.itemList.push(item);
				});
				platformDataServiceActionExtension.fireEntityCreated(data, newItem);

				return platformDataServiceSelectionExtension.doSelect(newItem, data).then(
					function () {
						if (data.newEntityValidator) {
							data.newEntityValidator.validate(newItem, container.service);
						}
						data.markItemAsModified(newItem, data);
						return newItem;
					},
					function () {
						data.markItemAsModified(newItem, data);
						return newItem;
					}
				);
			};

			container.data.clearContent = function clearTreeContent(data) {
				data.itemList.length = 0;
				data.itemTree.length = 0;
				if (data.listLoaded) {
					data.listLoaded.fire();
				}
			};

			container.data.moveItem = function moveItem(entities) {

				var deleteParams = {};

				angular.forEach(entities, function (entity) {
					deleteParams.entity = entity;
					deleteParams.index = container.data.itemList.indexOf(entity);

					container.data.doDeepRemove(deleteParams, true, container.data);
				});
				container.data.listLoaded.fire();
			};

			container.data.saveItemChildInfo = function saveItemChildInfo(item, info, data) {
				if (item[data.treePresOpt.childProp] && item[data.treePresOpt.childProp].length > 0) {
					info.subItem = [];
					info.hasChildren = true;

					_.forEach(item[data.treePresOpt.childProp], function (child) {
						info.subItem.push(child);
					});
				}
			};

			container.data.reestablishItemChildInfo = function reestablishItemChildInfo(item, info, data) {
				item.HasChildren = true;
				if (item[data.treePresOpt.childProp]) {
					item[data.treePresOpt.childProp].length = 0;
				} else {
					item[data.treePresOpt.childProp] = [];
				}

				_.forEach(info.subItem, function (child) {
					item[data.treePresOpt.childProp].push(child);
				});

				info.subItem.length = 0;
			};

			self.addListLoadingBehaviour(container, opt);
			container.data.flatten = function flatten(input, output, childProp) {
				var i;
				for (i = 0; i < input.length; i++) {
					output.push(input[i]);
					if (input[i][childProp] && input[i][childProp].length > 0) {
						flatten(input[i][childProp], output, childProp);
					}
				}
				return output;
			};

			container.data.doPrepareCreate = function doPrepareCreateInTree(data) {
				var creationData = {};
				creationData.parent = {};
				creationData.parentId = null;

				if (angular.isObject(data.parentService)) {
					creationData.MainItemId = data.parentService.getSelected().Id;
				}

				if (data.selectedItem && data.selectedItem.Id && data.selectedItem[data.treePresOpt.parentProp]) {
					creationData.parentId = data.selectedItem[data.treePresOpt.parentProp];
					creationData.parent = _.find(data.itemList, {Id: creationData.parentId});
				}

				if (data.treePresOpt.initCreationData) {
					data.treePresOpt.initCreationData(creationData, data);
				} else {
					creationData[data.treePresOpt.parentProp] = creationData.parentId;
				}

				return creationData;
			};

			container.data.doPrepareCreateChild = function doPrepareCreateChildInTree(data) {
				var creationData = {};
				if (!data.hasToReduceTreeStructures) {
					creationData.parent = {};
				}
				creationData.parentId = null;

				if (angular.isObject(data.parentService)) {
					creationData.MainItemId = data.parentService.getSelected().Id;
				}

				if (data.selectedItem && data.selectedItem.Id) {
					creationData.parentId = data.selectedItem.Id;
					if (!data.hasToReduceTreeStructures) {
						creationData.parent = data.selectedItem;
					}
				}

				if (data.treePresOpt.initCreationData) {
					data.treePresOpt.initCreationData(creationData, data);
				} else {
					creationData[data.treePresOpt.parentProp] = creationData.parentId;
				}

				return creationData;
			};

			container.data.onCreateSucceeded = function onCreateSucceededInTree(newData, data, creationData) {
				var newItem;
				if (opt.handleCreateSucceeded) {
					newItem = opt.handleCreateSucceeded(newData, data);// In case more data is send back from server it can be stripped down to the new item here.
					if (!newItem) {// Fall back, if no value is returned by handleCreateSucceeded
						newItem = newData;
					}
				} else {
					newItem = newData;
				}

				if (data.addEntityToCache) {
					data.addEntityToCache(newItem, data);
				}

				const parentId = newItem[data.treePresOpt.parentProp];
				if (!parentId) {
					data.itemTree.push(newItem);
					platformDataServiceEntitySortExtension.sortBranchOfTree(data.itemTree, data);
				} else {
					let parent = creationData.parent;
					if (!parent && data.hasToReduceTreeStructures) {
						parent = _.find(data.itemList, {Id: parentId});
					}
					parent.HasChildren = true;

					if (parent[data.treePresOpt.childProp] === null) {
						parent[data.treePresOpt.childProp] = [];
					}

					parent[data.treePresOpt.childProp].push(newItem);
					platformDataServiceEntitySortExtension.sortBranchOfTree(parent[data.treePresOpt.childProp], data);

					if (_.isFunction(container.data.processNewParent)) {
						container.data.processNewParent(parent, container.data);
					}
				}
				if (newItem[data.treePresOpt.childProp] && newItem[data.treePresOpt.childProp].length > 0) {
					newItem.HasChildren = true;
				} else {
					newItem.HasChildren = false;
					newItem[data.treePresOpt.childProp] = [];
				}

				return data.handleOnCreateSucceeded(newItem, data);
			};

			container.data.handleReadSucceeded = function onReadSucceededInTree(result, data) {
				var items;
				if (result.hasOwnProperty('FilterResult') && result.hasOwnProperty('dtos')) {
					items = result.dtos;
					if (data.isRoot && data.isRealRootForOpenedModule() && data.sidebarSearch) {
						data.clearSidebarFilter(result, data);
					}
				} else {
					items = result;
				}

				if (platformDataServiceSelectionExtension.supportSelection(data)) {
					platformDataServiceSelectionExtension.deselect(data);
				}
				data.itemTree.length = 0;
				for (var i = 0; i < items.length; ++i) {
					data.itemTree.push(items[i]);
				}
				data.itemList.length = 0;
				data.flatten(data.itemTree, data.itemList, data.treePresOpt.childProp);

				platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);

				data.listLoaded.fire({setTreeGridLevel: true});

				if (data.isRoot && platformDataServiceSelectionExtension.supportSelection(data)) {
					if (data.itemTree.length) {
						platformDataServiceSelectionExtension.doMultiSelect(data.itemTree[0], [data.itemTree[0]], data, data.numberOfSelectionChangeRequests);
					}
				}

				return data.itemTree;
			};

			if (opt.incorporateDataRead) {
				container.data.onReadSucceeded = opt.incorporateDataRead;
			} else {
				container.data.onReadSucceeded = container.data.handleReadSucceeded;
			}

			container.data.doPrepareDelete = function doPrepareDeleteInHierarchy(deleteParams, data) {
				var entity = getFirstEntity(deleteParams);
				if(data.useIdForIndexIdentification) {
					const entityId = entity.Id;
					deleteParams.index = _.findIndex(data.itemList, function(candidate) { return candidate.Id === entityId; });
				} else {
					deleteParams.index = entity ? data.itemList.indexOf(entity) : -1;
				}

				if(data.hasToReduceTreeStructures) {
					if(entity) {
						entity[data.treePresOpt.childProp] = [];
					}
					if(deleteParams.entities && deleteParams.entities.length > 0)
					{
						_.forEach(deleteParams.entities, function(toDelete) {
							toDelete[data.treePresOpt.childProp] = [];
						});
					}
				}
			};

			container.data.iterateHierachy = function iterateHierachy(entity, toDoCallbackFn, param, data) {
				if (entity[data.treePresOpt.childProp] && entity[data.treePresOpt.childProp].length > 0) {
					_.forEach(entity[data.treePresOpt.childProp], function (child) {
						toDoCallbackFn(child, param, data);
					});
				}
			};

			function deepRemoveEntityFromHierarchy(entity, parent, removeItem, data, service) {
				platformDataValidationService.removeDeletedEntityFromErrorList(entity, service);
				data.doClearModifications(entity, data);

				data.itemList = _.filter(data.itemList, function (item) {
					return item.Id !== entity.Id;
				});

				if (removeItem) {
					parent = parent || _.find(data.itemList, {Id: entity[data.treePresOpt.parentProp]});
					if (parent && parent.Id) {
						parent[data.treePresOpt.childProp] = _.filter(parent[data.treePresOpt.childProp], function (child) {
							return child.Id !== entity.Id;
						});
					} else {
						data.itemTree = _.filter(data.itemTree, function (root) {
							return root.Id !== entity.Id;
						});
					}
				}

				if (entity[data.treePresOpt.childProp] && entity[data.treePresOpt.childProp].length > 0) {
					angular.forEach(entity[data.treePresOpt.childProp], function (child) {
						deepRemoveEntityFromHierarchy(child, entity, false, data, service);
					});
				}
			}

			container.data.doDeepRemove = function deepRemove(deleteParams, removeItem, data) {
				var deleteEntities = deleteParams.entities || [];
				if (deleteParams.entity && deleteParams.entity.Id) {
					deleteEntities.push(deleteParams.entity);
				}
				var service = deleteParams.service;

				_.forEach(deleteEntities, function (entity) {
					deepRemoveEntityFromHierarchy(entity, null, removeItem, data, service);
				});
			};

			container.data.onDeleteDone = function onDeleteDoneInHierarchy(deleteParams, data, response) {
				self.handleOnDeleteSucceededInTree(deleteParams, data, response);
			};

			// Provide entities structured -> just the high level entities
			container.service.getTree = function getTree() {
				if (container.data.itemFilterEnabled) {
					return platformDataServiceItemFilterExtension.filterTree(container.data);
				}
				return container.data.itemTree;
			};

			container.service.read = function () {
				return container.data.doReadData(container.data);
			};
			container.service.load = function () {
				return container.data.doReadData(container.data);
			};
		};

		this.isServicePresented = function isServicePresented(data) {
			return !_.isNull(data.usingContainer) && !_.isEmpty(data.usingContainer);
		};

		this.serviceNeedsLoad = function serviceNeedsLoad(data) {
			if (data.parentService) {
				var parentItem = data.parentService.getSelected();
				return _.isEmpty(data.usingContainer) && parentItem && (!data.currentParentItem || parentItem.Id !== data.currentParentItem.Id);
			}

			return _.isEmpty(data.usingContainer);
		};

		this.handleOnCreateSucceededInList = function handleOnCreateSucceededInList(newItem, data, service) {
			platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);
			data.itemList.push(newItem);

			return platformDataServiceSelectionExtension.doSelect(newItem, data).then(
				function () {
					platformDataServiceActionExtension.fireEntityCreated(data, newItem);
					if (data.newEntityValidator) {
						data.newEntityValidator.validate(newItem, service);
					}
					data.markItemAsModified(newItem, data);
					return newItem;
				},
				function () {
					platformDataServiceActionExtension.fireEntityCreated(data, newItem);
					data.markItemAsModified(newItem, data);
					return newItem;
				}
			);
		};

		this.handleOnDeleteSucceededInList = function handleOnDeleteSucceededInList(deleteParams, data, response) {
			var deleteEntities = deleteParams.entities || [];
			if (deleteParams.entity && deleteParams.entity.Id) {
				deleteEntities.push(deleteParams.entity);
			}

			if (data.deleteFromSelections) {
				data.deleteFromSelections(deleteEntities, data);
			}
			data.doClearModifications(deleteEntities, data);
			data.itemList = _.filter(data.itemList, function (item) {
				return !_.find(deleteEntities, function (delEntity) {
					return item.Id === delEntity.Id;
				});
			});

			if (data.rootOptions && data.rootOptions.mergeAffectedItems) {
				data.rootOptions.mergeAffectedItems(response, data);
			}

			if (_.isFunction(data.handleOnDeleteSucceeded)) {
				data.handleOnDeleteSucceeded(deleteParams, data, response);
			}

			if (deleteParams.entity) {
				platformDataServiceActionExtension.fireEntityDeleted(data, deleteParams.entity);
			} else {
				platformDataServiceActionExtension.fireEntityDeleted(data, deleteParams.entities);
			}

			data.listLoaded.fire(data.itemList);
			platformDataServiceSelectionExtension.doSelectCloseTo(deleteParams.index, data);
		};

		this.handleOnDeleteSucceededInTree = function handleOnDeleteSucceededInTree(deleteParams, data, response) {
			data.doDeepRemove(deleteParams, true, data);

			if (response && data.rootOptions && data.rootOptions.mergeAffectedItems) {
				data.rootOptions.mergeAffectedItems(response, data);
			}

			if (_.isFunction(data.handleOnDeleteSucceeded)) {
				data.handleOnDeleteSucceeded(deleteParams, data, response);
			}

			if (deleteParams.entity) {
				platformDataServiceActionExtension.fireEntityDeleted(data, deleteParams.entity);
			} else {
				platformDataServiceActionExtension.fireEntityDeleted(data, deleteParams.entities);
			}

			data.listLoaded.fire(data.itemList);
			platformDataServiceSelectionExtension.doSelectCloseTo(deleteParams.index, data);
		};

		this.filterListToHighestLevelEntities = function filterListToHighestLevelEntities(entities, data) {
			var res = [];

			_.forEach(entities, function (entity) {
				if (!self.isElementOfParentHierarchyInList(entity, entities, data)) {
					res.push(entity);
					entity[data.treePresOpt.childProp] = [];// Remove children array as well, it may stil be very, very big.
				}
			});

			return res;
		};

		this.isElementOfParentHierarchyInList = function isElementOfParentHierarchyInList(entity, entities, data) {
			var res = false;// We default to no element of parent hierarchy have been deleted as well
			var parentId = entity[data.treePresOpt.parentProp];
			if (parentId) {
				var parent = _.find(entities, {Id: parentId});
				if (!parent) {
					parent = _.find(data.itemList, {Id: parentId});
					if (!parent) {
						res = self.isElementOfParentHierarchyInList(parent, entities, data);// Parent found, we need to check if it or
						// one of its parents has been deleted as well.
					} else {
						res = false;// There may be a parent, but this is not on the client -> it is like a root on client
					}
				} else {
					res = true;// Parent is found in entities
				}
			} else {
				res = false;// Element is root
			}

			return res;
		};
	}
})();
