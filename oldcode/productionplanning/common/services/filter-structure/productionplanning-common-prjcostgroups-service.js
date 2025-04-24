/**
 * Created by las on 2/1/2018.
 */

(function () {
	'use strict';
	var ppsCommonModule = angular.module('productionplanning.common');
	/*global angular, globals*/

	ppsCommonModule.factory('productionplanningCommonPrjcostgroupsService', ['platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'productionplanningCommonStructureFilterService',
		function (platformDataServiceFactory, ServiceDataProcessArraysExtension, PpsCommonStructureFilterService) {

			var service4PrjCostGroup = [];
			var mainServiceName = {};

			function createCostGroupsDataService(mainService, route) {
				mainServiceName = mainService.getServiceName();
				var service = service4PrjCostGroup[mainServiceName+route];
				if (service === null || service === undefined) {
					var projectId = mainService.getSelectedProjectId();
					var serviceOption = {
						hierarchicalRootItem: {
							module: ppsCommonModule,
							serviceName: 'productionplanningCommonPrjcostgroupsService',
							httpRead: {
								route: globals.webApiBaseUrl + 'project/main/' + route + '/',
								endRead: 'tree',
								usePostForRead: true,
								initReadData: function (readData) {
									readData.PKey1 = mainService.getSelectedProjectId();
								}
							},
							//dataProcessor: [new ServiceDataProcessArraysExtension(['SubGroups']), new ProjectMainCostGroupsImageProcessor(route.slice(-1))],
							useItemFilter: true,
							presenter: {tree: {parentProp: 'CostGroupParentFk', childProp: 'SubGroups',
								incorporateDataRead: function (readData, data)
								{
									var result = {
										FilterResult: readData.FilterResult,
										dtos: readData || []
									};
									var allIds = PpsCommonStructureFilterService.getAllFilterIds(mainServiceName);
									if(allIds)
									{
										var filterKey = 'PRJCOSTGROUP' + route.slice(route.length-1, route.length);
										var markerIds = allIds[filterKey];
										if(markerIds  && markerIds.length > 0){
											setItemMarkers(result.dtos, markerIds);
										}
									}

									return serviceContainer.data.handleReadSucceeded(result, data);
								}}},
							entityRole: {
								root: {
									moduleName: 'productionplanning.common',
									itemName: 'EstPrjCostGrp' + route.slice(-1),
									handleUpdateDone: function (updateData, response) {
										mainService.updateList(updateData, response);
									}
								}
							},
							actions: {} // no create/delete actions
						}
					};
					/* jshint -W003 */
					var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
					service = serviceContainer.service;
					service.setShowHeaderAfterSelectionChanged(null);
					service4PrjCostGroup[mainServiceName+route] = service;
					service.setFilter('projectId=' + projectId);

					if (projectId) {
						service.load();
					}
				}

				return service;
			}

			function collectPrjCostGroupsIds(prjCostGroupItem) {
				return _.map(PpsCommonStructureFilterService.collectItems(prjCostGroupItem, 'SubGroups'), 'Id');
			}

			function extendByFilter(mainServiceName, costGroupDataService, id, filterService, costGroupNumber) {

				var costgroupName = 'PrjCostGroup' + costGroupNumber + 'Fk';
				var allIds = [];

				// filter leading structure by line items
				if (angular.isFunction(filterService.addLeadingStructureFilterSupport)) {
					filterService.addLeadingStructureFilterSupport(mainServiceName, costGroupDataService, costgroupName);
				}


				costGroupDataService.markersChanged = function markersChanged(itemList) {
					var filterKey = 'PRJCOSTGROUP' + costGroupNumber;

					if (_.isArray(itemList) && _.size(itemList) > 0) {
						allIds = [];
						// get all child prj cost group (for each item)
						_.each(itemList, function (item) {
							var Ids = collectPrjCostGroupsIds(item);
							allIds = allIds.concat(Ids);
						});
						if (_.isFunction(filterService.setFilterIds)) {
							filterService.setFilterIds(mainServiceName, filterKey, allIds);
						}
						filterService.addFilter(id, costGroupDataService, function (lineItem) {
							var	element = lineItem[costgroupName];
							return allIds.indexOf(element) >= 0;
						}, {
							id: filterKey,
							iconClass: 'tlb-icons ico-filter-prjcostgroup' + costGroupNumber,
							captionId: 'filterPrjcostgroup' + costGroupNumber
						}, costgroupName);
					} else {
						if (_.isFunction(filterService.setFilterIds)) {
							filterService.setFilterIds(mainServiceName, filterKey, []);
						}
						filterService.removeFilter(id);
					}
				};
			}

			function setItemMarkers(costGroups, markerIds) {
				_.each(costGroups, function (costGroup) {
					costGroup.IsMarked = markerIds.indexOf(costGroup.Id) >= 0;
					setItemMarkers(costGroup.SubGroups, markerIds);
				});
			}

			function getPrjCostGroup1List() {
				var id = mainServiceName+ 'costgroup1';
				return getPrjCostGroupList(id);
			}

			function getPrjCostGroup2List() {
				var id = mainServiceName+ 'costgroup2';
				return getPrjCostGroupList(id);
			}

			function getPrjCostGroup3List() {
				var id = mainServiceName+ 'costgroup3';
				return getPrjCostGroupList(id);
			}

			function getPrjCostGroup4List() {
				var id = mainServiceName+ 'costgroup4';
				return getPrjCostGroupList(id);
			}

			function getPrjCostGroup5List() {
				var id = mainServiceName+ 'costgroup5';
				return getPrjCostGroupList(id);
			}

			function getPrjCostGroupList(id) {

				var list = [];
				var service = service4PrjCostGroup[id];
				if (service) {
					list = service.getList();
				}
				return list;
			}

			return {
				createCostGroupsDataService: createCostGroupsDataService,
				collectPrjCostGroupsIds: collectPrjCostGroupsIds,
				extendByFilter: extendByFilter,
				getPrjCostGroup1List: getPrjCostGroup1List,
				getPrjCostGroup2List: getPrjCostGroup2List,
				getPrjCostGroup3List: getPrjCostGroup3List,
				getPrjCostGroup4List: getPrjCostGroup4List,
				getPrjCostGroup5List: getPrjCostGroup5List
			};
		}]);

})();