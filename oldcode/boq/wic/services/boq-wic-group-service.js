/**
 * Created by bh on 06.05.2015.
 */
(function () {
	'use strict';
	/* global globals, _ */
	var moduleName = 'boq.wic';
	var boqWICModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name boqWicGroupService
	 * @function
	 *
	 * @description
	 * boqWicGroupService is the data service for all boq wic group related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	boqWICModule.factory('boqWicGroupService', ['platformDataServiceFactory', 'cloudCommonGridService', 'platformModalService', '$q', '$http', 'platformPermissionService', 'PlatformMessenger', 'basicsLookupdataLookupDescriptorService', 'platformModuleNavigationService',
		function (platformDataServiceFactory, cloudCommonGridService, platformModalService, $q, $http, platformPermissionService, PlatformMessenger, basicsLookupdataLookupDescriptorService, platformModuleNavigationService) {

			var completeItemCreated = new PlatformMessenger();
			// The instance of the main service - to be filled with functionality below
			var boqServiceOption = {
				hierarchicalRootItem: {
					module: boqWICModule,
					serviceName: 'boqWicGroupService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'boq/wic/group/', entryRead: 'tree',
						initReadData: function(readData) {
							readData.filter = '?asMap=true';
						}
					},
					presenter: {
						tree: {
							parentProp: 'WicGroupFk', childProp: 'WicGroups',
							incorporateDataRead: function (readData, data) {
								return serviceContainer.data.handleReadSucceeded(readData.dtos, data);
							},
						}
					},
					entityRole: {
						root: {
							itemName: 'WicGroups',
							moduleName: 'cloud.desktop.moduleDisplayNameWIC',
							codeField: 'Code',
							descField: 'DescriptionInfo.Translated'
						}
					},
					entitySelection: {supportsMultiSelection: true},
					useItemFilter: true,
					translation: {
						uid: 'boqWicGroupService',
						title: 'boq.wic.wicGroupListTitle',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: { moduleSubModule: 'Boq.Wic', typeName: 'WicGroupDto' }
					}
				}
			};

			var lookupData = {
				wicGroupList: []
			};
			var serviceContainer = platformDataServiceFactory.createNewComplete(boqServiceOption);
			var service = serviceContainer.service;
			var data = serviceContainer.data;

			data.updateOnSelectionChanging = null;
			var highlightedWicCatBoqId = null;

			service.completeItemCreated = completeItemCreated;
			var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
			serviceContainer.data.onCreateSucceeded = function (newData, data, creationData) {
				onCreateSucceeded(newData.WicGroup, data, creationData).then(function () {
					service.completeItemCreated.fire(null, newData);
				});
			};

			service.loadWicGroup = function loadWicGroup() {
				var defer = $q.defer();
				service.load().then(function (data) {
					service.setDataItems(data);
					defer.resolve(data);
				});
				return defer.promise;
			};
			service.setItemFilter = function setItemFilter(predicate) {
				data.itemFilter = predicate;
				if (predicate === null) {
					data.itemFilterEnabled = false;
				}
			};

			angular.extend(service, {
				reset: new PlatformMessenger(),
				getWicGroupId: getWicGroupId,
				resetSelectedItem: resetSelectedItem,
				expandNodeParent: expandNodeParent,
				getItemByIdAsync: getItemByIdAsync,
				getFlattenByTree: getFlattenByTree,
				filteredWicGroup: filteredWicGroup,
				getWicGroupItemById: getWicGroupItemById,
				getHighlightedWicCatBoqId: getHighlightedWicCatBoqId,
				clearHighlightedWicCatBoqId: clearHighlightedWicCatBoqId
			});

			platformModuleNavigationService.registerNavigationEndpoint({
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					if (triggerField === 'BoqWicCatBoqFk' && Object.prototype.hasOwnProperty.call(item, 'BoqWicCatFk')) {
						let groupId = item['BoqWicCatFk'];
						let wicCatBoqId = item['BoqWicCatBoqFk'];
						$http.get(globals.webApiBaseUrl + 'boq/wic/group/GetItemById?id=' + groupId).then(function (res) {
							setHighlightedWicCatBoqId(wicCatBoqId);
							serviceContainer.data.onReadSucceeded([res.data], serviceContainer.data);
						});
					}
				}
			});

			function getItemByIdAsync(id) {
				var wicCatFk = 'wicCatFk';
				if (basicsLookupdataLookupDescriptorService.hasLookupItem(wicCatFk, id)) {
					return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem(wicCatFk, id));
				} else {
					if (!lookupData.wicGroupPromise) {
						lookupData.wicGroupPromise = getWicGroupListAsync();
					}

					return lookupData.wicGroupPromise.then(function () {
						lookupData.wicGroupPromise = null;
						return service.getWicGroupItemById(id);
					});
				}

			}

			function getWicGroupListAsync() {
				var wicCatFk = 'wicCatFk';
				if (lookupData.wicGroupList.length) {
					return $q.when(lookupData.wicGroupList);
				} else {
					if (!lookupData.wicGroupListAsyncPromise) {
						lookupData.wicGroupListAsyncPromise = $http.get(globals.webApiBaseUrl + 'boq/wic/group/tree').then(function (response) {
							var flattenResult = [];
							cloudCommonGridService.flatten(response.data, flattenResult, 'WicGroups');
							basicsLookupdataLookupDescriptorService.updateData(wicCatFk, flattenResult);

							return response.data;
						});
					}

					return lookupData.wicGroupListAsyncPromise.then(function (data) {
						lookupData.wicGroupListAsyncPromise = null;
						lookupData.wicGroupList = data;
						return lookupData.wicGroupList;
					});
				}
			}

			function getFlattenByTree(treeList) {
				var itemList = [];
				data.flatten(treeList, itemList, data.treePresOpt.childProp);
				return itemList;
			}

			function getWicGroupItemById(value) {
				var itemCache = basicsLookupdataLookupDescriptorService.getLookupItem('wicCatFk', value);
				return itemCache;
			}

			service.setDataItems = function setDataItems(wicGroup) {
				data.itemTree = wicGroup || [];
				_.each(data.itemTree, function (item) {
					processData(item);
				});

				data.itemList = getFlattenByTree(data.itemTree);

				_.forEach(data.itemList, function (item) {
					item.PermissionObjectInfo = null;
				});
			};

			function processData(node) {
				processTreeData(node, 0);
			}

			function processTreeData(node, level) {
				node.nodeInfo = node.nodeInfo || {};
				node.nodeInfo = {
					collapsed: true,
					level: level,
					children: node.HasChildren
				};
				if (node.HasChildren) {
					_.forEach(node.WicGroups, function (catChildren) {
						processTreeData(catChildren, level + 1);
					});
				}
			}

			function getWicGroupId() {
				var wicGroup = service.getSelectedEntities();
				if (!_.isEmpty(wicGroup) && wicGroup.length > 0) {
					return wicGroup[0].Id;
				} else {
					return 0;
				}
			}

			function resetSelectedItem() {
				data.selectedItem = null;
			}

			function filteredWicGroup(entity, treeList) { // basic filter of composite types for category parents.
				var BoqWicCatFk = entity.BoqWicCatFk;
				var selectWicGroup = _.filter(treeList, {'Id': BoqWicCatFk});
				return (selectWicGroup && selectWicGroup.length) ? selectWicGroup : treeList;
			}

			function expandNodeParent(node) {
				if (node && node.nodeInfo) {
					node.nodeInfo.collapsed = false;
					if (node.nodeInfo.level !== 0) {
						var parent = _.find(service.getUnfilteredList(), {'Id': node.WicGroupFk});
						return expandNodeParent(parent);
					} else {
						return node;
					}
				}
			}

			function setHighlightedWicCatBoqId(wicCatBoqId) {
				highlightedWicCatBoqId = wicCatBoqId;
			}

			function getHighlightedWicCatBoqId() {
				return highlightedWicCatBoqId;
			}

			function clearHighlightedWicCatBoqId() {
				highlightedWicCatBoqId = null;
			}

			service.getWicGroupList = function getWicGroupList() {
				return getWicGroupListAsync();
			};
			return service;
		}]);
})();
