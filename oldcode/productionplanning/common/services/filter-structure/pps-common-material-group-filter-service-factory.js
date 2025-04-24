/**
 * Created by anl on 7/2/2019.
 */

(function () {
	/*global angular*/
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsCommonMaterialGroupFilterDataServiceFactory', [
		'cloudDesktopSidebarService',
		'productionplanningCommonStructureFilterService',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'ServiceDataProcessArraysExtension',
		'cloudCommonGridService',

		function (cloudDesktopSidebarService,
				  ppsCommonStructureFilterService,
				  basicsLookupdataLookupDescriptorService,
				  platformDataServiceFactory,
				  ServiceDataProcessArraysExtension,
				  cloudCommonGridService) {

			var serviceCache = {};
			var filterKey = 'MATERIALGROUP';

			function getMaterialFilterService(_moduleName, _serviceName) {
				var service = serviceCache[_serviceName];
				if (!service) {
					var serviceOption = {
						hierarchicalRootItem: {
							module: angular.module(_moduleName),
							serviceName: _serviceName,
							httpRead: {
								route: globals.webApiBaseUrl + 'basics/materialcatalog/group/',
								endRead: 'pps/grouptree'
							},
							dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems'])],
							useItemFilter: true,
							presenter: {
								tree: {
									parentProp: 'MaterialGroupFk', childProp: 'ChildItems',
									incorporateDataRead: function (readData, data) {
										var allIds = ppsCommonStructureFilterService.getAllFilterIds(_serviceName);
										if (allIds) {
											var markerIds = allIds[filterKey];
											if (markerIds && markerIds.length > 0) {
												service.setItemMarkers(readData, markerIds);
											}
										}
										var flattenMdcGroup = [];
										flattenMdcGroup = cloudCommonGridService.flatten(readData, flattenMdcGroup, 'ChildItems');
										basicsLookupdataLookupDescriptorService.updateData('flattenMdcGroup',flattenMdcGroup);
										return data.handleReadSucceeded(readData, data);
									}
								}
							},
							entityRole: {
								root: {
									moduleName: _moduleName,
									itemName: 'MaterialGroup'
								}
							},
							actions: {} // no create/delete actions
						}
					};
					var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
					service = serviceContainer.service;

					service.setShowHeaderAfterSelectionChanged(null);

					service.collectMaterialGroupIds = function collectMaterialGroupIds(SelectedMaterialGroup) {
						return _.map(ppsCommonStructureFilterService.collectItems(SelectedMaterialGroup, 'MaterialGroups'), 'Id');
					};

					service.setItemMarkers = function(materialGroups, markerIds, markedMaterialGroups) {
						_.each(materialGroups, function (group) {
							group.IsMarked = markerIds.indexOf(group.Id) >= 0;
							if (group.IsMarked && markedMaterialGroups && _.isArray(markedMaterialGroups)) {
								markedMaterialGroups.push(group);
							}
						});
					};

					service.getMarkedItems = function (materialGroups, markedMaterialGroups) {
						if (materialGroups && _.isArray(materialGroups)) {
							_.each(materialGroups, function (group) {
								if (group.IsMarked) {
									markedMaterialGroups.push(group);
								}
							});
						}
					};

					service.clearMarkers = function () {
						service.markedItems = [];
					};

					service.extendByFilter = function extendByFilter(mainServiceName, id, filterService){
						var MaterialGroupFk = 'MaterialGroupFk';
						var filterIds = [];

						if (angular.isFunction(filterService.addLeadingStructureFilterSupport)) {
							filterService.addLeadingStructureFilterSupport(mainServiceName, service, MaterialGroupFk);
						}

						service.markersChanged = function markersChanged(itemList) {
							if (_.isArray(itemList) && _.size(itemList) > 0) {
								filterIds.length = 0;
								// get all child prj cost group (for each item)
								_.each(itemList, function (item) {
									var Ids = service.collectMaterialGroupIds(item);
									filterIds = filterIds.concat(Ids);
								});
								if (_.isFunction(filterService.setFilterIds)) {
									filterService.setFilterIds(mainServiceName, filterKey, filterIds);
								}
								filterService.addFilter(id, service, function () {
									return true;
								}, {
									id: filterKey,
									iconClass: 'app-small-icons ico-materials',
									captionId: 'filterMaterialGroup'
								}, MaterialGroupFk);
							} else {
								service.markedItems = [];
								if (_.isFunction(filterService.setFilterIds)) {
									filterService.setFilterIds(mainServiceName, filterKey, []);
								}
								filterService.removeFilter(id);
							}
						};
					};
					serviceCache[_serviceName] = service;
					service.load();

				}
				return service;
			}

			return {
				getMaterialFilterService: getMaterialFilterService
			};
		}
	]);
})();