/**
 * Created by lid on 7/4/2017.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('treeviewListDialogTreeviewFactoryService', TreeviewListDialogTreeviewFactoryService);
	TreeviewListDialogTreeviewFactoryService.$inject = ['$q', 'PlatformMessenger', 'platformDataServiceFactory',
		'ServiceDataProcessArraysExtension', 'basicsLookupdataLookupFilterService', '_'];

	function TreeviewListDialogTreeviewFactoryService($q, PlatformMessenger, platformDataServiceFactory,
		ServiceDataProcessArraysExtension, basicsLookupdataLookupFilterService, _) {

		const serviceFactroy = {};
		const serviceCache = {};

		serviceFactroy.createNewComplete = function createNewComplete(moduleId, serviceOption) {

			const serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			const service = serviceContainer.service;
			const data = serviceContainer.data;
			let allCategories = [];
			let reloadData = false;

			service.setShowHeaderAfterSelectionChanged(null);
			data.updateOnSelectionChanging = null;

			angular.extend(service, {
				loadAllStructureCategories: loadAllStructureCategories,
				filterStructureCategories: filterStructureCategories,
				clear: clear,
				getFilteredList: getFilteredList,
				fireItemFiltered: fireItemFiltered,
				reloadGridExpanded: reloadGridExpanded,
				expandNode: expandNode,
				processData: processData,
				setReloadData: setReloadData,

				refreshList: new PlatformMessenger(),
				collapseAll: new PlatformMessenger(),
				reset: new PlatformMessenger()
			});

			return service;

			function processTreeData(node, level) {
				if (angular.isUndefined(node.nodeInfo)) {
					node.nodeInfo = {
						collapsed: true,
						level: level,
						children: node.HasChildren
					};

					if (node.HasChildren) {
						_.forEach(node.ChildItems, function (catChildren) {
							processTreeData(catChildren, level + 1);
						});
					}
				} else if (node.nodeInfo && node.nodeInfo.collapsed) {
					node.nodeInfo.collapsed = true;
				}
			}

			function processData(node) {
				processTreeData(node, 0);
			}

			function loadAllStructureCategories() {
				const defer = $q.defer();
				if (reloadData || _.isEmpty(allCategories)) {
					data.doCallHTTPRead({filter: ''}, data, function (categories) {

						defer.resolve(categories);
						data.itemTree = categories || [];

						data.flatten(data.itemTree, data.itemList, data.treePresOpt.childProp);
						allCategories = data.itemList;

						// _.each(data.itemList, function (item) {
						// Processor.processItem(item);
						// });
					});
				} else {
					defer.resolve(allCategories);
				}
				return defer.promise;
			}

			function filterStructureCategories(options) {
				const lookupOptions = options.lookupOptions;
				if (lookupOptions && lookupOptions.filterKey) {
					const filter = basicsLookupdataLookupFilterService.getFilterByKey(lookupOptions.filterKey);
					service.setItemFilter(filter.fn);
					service.enableItemFilter(true);
				} else {
					service.setItemFilter(null);
					service.enableItemFilter(false);
				}
			}

			function clear() {
				data.doClearModifications(null, data);
			}

			function getFilteredList(options) {
				const lookupOptions = options.lookupOptions;
				let list = service.getUnfilteredList();
				if (lookupOptions && lookupOptions.filterKey) {
					const filter = basicsLookupdataLookupFilterService.getFilterByKey(lookupOptions.filterKey);
					list = _.filter(list, filter.fn);
				}
				return list;
			}

			function fireItemFiltered(itemlist, foreignKeyName) {// filter cat by itemList.
				const filteredCategories = _.uniq(_.map(itemlist, foreignKeyName));
				if (foreignKeyName === 'ProductDescriptionFk') {
					_.each(filteredCategories, function (item, idx) {
						filteredCategories[idx] = item * 10 + 4;
					});
				}
				if (itemlist.length === 1) {
					const category = _.find(service.getUnfilteredList(), {Id: filteredCategories[0]});
					service.setItemFilter(function (structureCatEntity) {
						return category.Id === structureCatEntity.Id;
					});
					service.enableItemFilter(true);
				} else {
					service.setItemFilter(function (structureCatEntity) {
						return structureCatEntity.Id ? filteredCategories.indexOf(structureCatEntity.Id) >= 0 : false;
					});
					service.enableItemFilter(true);
				}
			}

			function expandNode(node) {
				if (node && node.Id && node.nodeInfo) {
					node.nodeInfo.collapsed = false;
				}

				if (node && node.ParentFk) {
					const parent = _.find(service.getUnfilteredList(), {'Id': node.ParentFk});
					expandNode(parent);
				}
			}

			function reloadGridExpanded() {
				data.listLoaded.fire();
			}

			function setReloadData(value) {
				reloadData = value;
			}
		};

		// get service or create service by module name
		serviceFactroy.getService = function getService(moduleId, serviceOption) {
			if (!serviceCache[moduleId]) {
				serviceCache[moduleId] = serviceFactroy.createNewComplete(moduleId, serviceOption);
			}
			return serviceCache[moduleId];
		};
		return serviceFactroy;
	}
})(angular);