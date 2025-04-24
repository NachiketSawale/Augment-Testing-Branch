/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, _ */

(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainResGroupDialogLookupService', [
		'$q', 'PlatformMessenger', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataLookupFilterService',
		function ($q, PlatformMessenger, platformDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataLookupFilterService) {

			let serviceOptions = {
				hierarchicalRootItem: {
					module: angular.module(moduleName),
					serviceName: 'estimateMainResGroupDialogLookupService',
					httpRead: { route: globals.webApiBaseUrl + 'basics/customize/resourcegroup/', endRead: 'list', usePostForRead: true },
					actions: {},
					presenter: {
						tree: {
							parentProp: 'GroupFk',
							childProp: 'GroupChildren',
							childSort : true
						}

					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['GroupChildren']),  {processItem: processData}],
					useItemFilter: true,
					entityRole: {
						root: {
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							codeField: 'GroupFk',
							itemName: 'ResGroup',
							moduleName: moduleName
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			let service = serviceContainer.service;
			let data = serviceContainer.data;
			let allCategories = [];

			service.setShowHeaderAfterSelectionChanged(null);
			data.updateOnSelectionChanging = null;

			angular.extend(service, {
				loadAllResGroups: loadAllResGroups,
				filterResGroups: filterResGroups,
				clear: clear,
				getFilteredList: getFilteredList,
				fireItemFiltered: fireItemFiltered,
				reloadGridExpanded: reloadGridExpanded,
				expandNode: expandNode,

				refreshList: new PlatformMessenger(),
				collapseAll: new PlatformMessenger(),
				reset: new PlatformMessenger()
			});

			return service;

			function processTreeData(node, level){
				if (angular.isUndefined(node.nodeInfo)) {
					node.nodeInfo = {
						collapsed: true,
						level: level,
						children: node.HasChildren
					};

					if (node.HasChildren){
						_.forEach(node.GroupChildren, function(catChildren){
							processTreeData(catChildren, level + 1);
						});
					}
				}
				else if (node.nodeInfo && node.nodeInfo.collapsed) {
					node.nodeInfo.collapsed = true;
				}
			}

			function processData(node){
				processTreeData(node, 0);
			}

			function filterResGroups(){
				service.setItemFilter(null);
				service.enableItemFilter(false);
			}

			function clear(){
				data.doClearModifications(null, data);
			}

			function getFilteredList(options, entity){
				let lookupOptions = options.lookupOptions;
				let list = service.getUnfilteredList();
				if (lookupOptions && lookupOptions.filterKey) {
					let filter = basicsLookupdataLookupFilterService.getFilterByKey(lookupOptions.filterKey);
					let filterFn = function (item) {
						return filter.fn(item, entity || {});
					};
					list = _.filter(list, filterFn);
				}
				return list;
			}

			function fireItemFiltered(list){
				let filteredCategories = _.uniq(_.map(list, 'GroupFk'));

				if (list.length === 1){
					let category = _.find(service.getUnfilteredList(), { Id: filteredCategories[0] });
					service.setItemFilter(function (resGroupEntity) {
						return category.Id === resGroupEntity.Id;
					});
					service.enableItemFilter(true);
				}else{
					service.setItemFilter(function (resGroupEntity) {
						return resGroupEntity.Id ? filteredCategories.indexOf(resGroupEntity.Id) >= 0 : false;
					});
					service.enableItemFilter(true);
				}
			}

			function loadAllResGroups(){
				let defer = $q.defer();
				if (_.isEmpty(allCategories)){
					data.doCallHTTPRead({filter: ''}, data, function(categories){
						defer.resolve(categories);
						data.itemTree = categories || [];

						data.flatten(data.itemTree, data.itemList, data.treePresOpt.childProp);
						allCategories = data.itemList;

					});
				}else{
					defer.resolve(allCategories);
				}
				return defer.promise;
			}

			function expandNode(node){
				if (node && node.Id && node.nodeInfo){
					node.nodeInfo.collapsed = false;
				}

				if (node && node.GroupFk){
					let parent = _.find(service.getUnfilteredList(), { 'Id': node.GroupFk });
					expandNode(parent);
				}
			}

			function reloadGridExpanded(){
				data.listLoaded.fire();
			}
		}
	]);
})(angular);
