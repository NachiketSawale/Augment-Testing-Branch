/**
 * Created by wed on 09/04/2019.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsCostGroupFilterStructureDataFactory', [
		'_',
		'globals',
		'$http',
		'$q',
		'cloudCommonGridService',
		'platformDataServiceFactory',
		'basicsCostGroupFilterCacheService',
		'basicsCostGroupFilterCacheTypes',
		function (_,
		          globals,
		          $http,
		          $q,
		          cloudCommonGridService,
		          platformDataServiceFactory,
		          filterCacheService,
		          cacheTypes) {

			function createService(serviceDescriptor, mainService, catalogService, filterService, createOptions) {
				if (!filterCacheService.hasService(cacheTypes.COSTGROUP_STRUCTURE_DATA_SERVICE, serviceDescriptor)) {

					var serviceName = filterCacheService.getCacheKey(cacheTypes.COSTGROUP_STRUCTURE_DATA_SERVICE, serviceDescriptor),
						options = angular.merge({
							onCheckChanged: function (checkItems, newCheckedItems) {
								return checkItems;
							}
						}, createOptions),
						serviceContainer = null,
						serviceOptions = {
							hierarchicalRootItem: {
								module: angular.module(moduleName),
								serviceName: serviceName,
								httpCRUD: {
									route: globals.webApiBaseUrl + 'basics/costgroups/costgroup/',
									usePostForRead: true,
									initReadData: function (readData) {
										readData.PKey1 = catalogService.getSelected().Id;
									}
								},
								entityRole: {
									root: {
										itemName: 'CostGroup'
									}
								},
								presenter: {
									tree: {
										parentProp: 'CostGroupFk',
										childProp: 'ChildItems',
										incorporateDataRead: function (readData, data) {
											var filterItems = filterService.getFilters();
											if (filterItems.length > 0) {
												var flatList = cloudCommonGridService.flatten(readData, [], 'ChildItems');
												_.each(flatList, function (item) {
													if (_.find(filterItems, {Id: item.Id})) {
														item.IsMarked = true;
													}
												});
											}
											return serviceContainer.data.handleReadSucceeded(readData, data);
										}
									}
								},
								actions: {create: false, delete: false},
								useItemFilter: true
							}
						};

					serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

					serviceContainer.data.rootOptions.codeField = null;
					serviceContainer.data.rootOptions.descField = null;

					serviceContainer.service.markersChanged = function (newCheckedItems) {
						var catalogId = catalogService.getSelected().Id,
							currFlatList = cloudCommonGridService.flatten(newCheckedItems, [], 'ChildItems');

						filterService.removeFilter(function (item) {
							return item.CostGroupCatFk === catalogId;
						}, true, false);

						_.each(newCheckedItems, function (item) {
							item.IsMarked = true;
						});

						if (currFlatList.length > 0) {
							filterService.addFilter(currFlatList);
						}

						options.onCheckChanged(filterService.getFilters(), newCheckedItems);
					};

					serviceContainer.service.setItemFilter(function (item) {
						var entityField = 'costgroup_' + item.CostGroupCatFk;
						var ids = _.compact(_.map(mainService.getList(), entityField));
						return ids.indexOf(item.Id) >= 0;
					});

					catalogService.onSelectedChanged.register(function () {
						serviceContainer.service.load();
					});

					filterService.onRemoveFilter.register(function (checkedItems, removeItems) {
						serviceContainer.service.gridRefresh();
					});

					filterCacheService.setService(cacheTypes.COSTGROUP_STRUCTURE_DATA_SERVICE, serviceDescriptor, serviceContainer.service);

				}
				return filterCacheService.getService(cacheTypes.COSTGROUP_STRUCTURE_DATA_SERVICE, serviceDescriptor);
			}

			return {
				createService: createService
			};

		}]);

})(angular);