/**
 * Created by las on 2/1/2018.
 */

(function () {
	'use strict';
	var ppsCommonModule = angular.module('productionplanning.common');
	/*global angular, globals*/

	ppsCommonModule.factory('productionplanningCommonLiccostgroupsService', ['platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'productionplanningCommonStructureFilterService',
		function (platformDataServiceFactory, ServiceDataProcessArraysExtension, PpsCommonStructureFilterService) {

			var service4LicCostGroup = [];
			var mainServiceName = {};

			function createCostGroupsDataService(mainService, route) {
				mainServiceName = mainService.getServiceName();
				var service = service4LicCostGroup[mainServiceName+route];

				if (service === null || service === undefined) {
					var serviceOption = {
						hierarchicalRootItem: {
							module: ppsCommonModule,
							serviceName: 'PpsCommonLic' + route + 'Service',
							httpRead: {route: globals.webApiBaseUrl + 'basics/' + route + '/', endRead: 'lookuptree'},
							dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems'])],//, new BasicsCostgroupsImageProcessor(route.slice(-1))
							useItemFilter: true,
							presenter: {tree: {parentProp: 'LicCostGroupFk', childProp: 'ChildItems',
								incorporateDataRead: function (readData, data)
								{
									var result = {
										FilterResult: readData.FilterResult,
										dtos: readData || []
									};
									var allIds = PpsCommonStructureFilterService.getAllFilterIds(mainServiceName);
									if(allIds)
									{
										var filterKey = 'LICCOSTGROUP' + route.slice(route.length-1, route.length);
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
									itemName: 'EstLicCostGrp' + route.slice(-1),
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
					service4LicCostGroup[mainServiceName+route] = service;
					service.load();
				}

				return service;
			}

			function collectLicCostGroupsIds(licCostGroupItem) {
				return _.map(PpsCommonStructureFilterService.collectItems(licCostGroupItem, 'ChildItems'), 'Id');
			}

			function extendByFilter(mainServiceName, costGroupDataService, id, filterService, costGroupNumber) {

				var costgroupName = 'LicCostGroup' + costGroupNumber + 'Fk';
				var allIds = [];

				// filter leading structure by line items
				if (angular.isFunction(filterService.addLeadingStructureFilterSupport)) {
					filterService.addLeadingStructureFilterSupport(mainServiceName, costGroupDataService, costgroupName);
				}

				costGroupDataService.markersChanged = function markersChanged(itemList) {
					var filterKey = 'LICCOSTGROUP' + costGroupNumber;
					if (_.isArray(itemList) && _.size(itemList) > 0) {
						allIds.length = 0;
						// get all child prj cost group (for each item)
						_.each(itemList, function (item) {
							var Ids = collectLicCostGroupsIds(item);
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
							iconClass: 'tlb-icons ico-filter-liccostgroup' + costGroupNumber,
							captionId: 'filterLiccostgroup' + costGroupNumber
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
					setItemMarkers(costGroup.ChildItems, markerIds);
				});
			}

			function getLicCostGroup1List() {
				var id = mainServiceName+'costgroups1';
				return getLicCostGroupList(id);
			}

			function getLicCostGroup2List() {
				var id = mainServiceName+'costgroups2';
				return getLicCostGroupList(id);
			}

			function getLicCostGroup3List() {
				var id = mainServiceName+'costgroups3';
				return getLicCostGroupList(id);
			}

			function getLicCostGroup4List() {
				var id = mainServiceName+'costgroups4';
				return getLicCostGroupList(id);
			}

			function getLicCostGroup5List() {
				var id = mainServiceName+'costgroups5';
				return getLicCostGroupList(id);
			}

			function getLicCostGroupList(id) {
				var list = [];
				var service = service4LicCostGroup[id];
				if (service) {
					list = service.getList();
				}
				return list;
			}

			return {
				createCostGroupsDataService: createCostGroupsDataService,
				collectLicCostGroupsIds: collectLicCostGroupsIds,
				extendByFilter: extendByFilter,
				getLicCostGroup1List: getLicCostGroup1List,
				getLicCostGroup2List: getLicCostGroup2List,
				getLicCostGroup3List: getLicCostGroup3List,
				getLicCostGroup4List: getLicCostGroup4List,
				getLicCostGroup5List: getLicCostGroup5List
			};
		}]);
})();