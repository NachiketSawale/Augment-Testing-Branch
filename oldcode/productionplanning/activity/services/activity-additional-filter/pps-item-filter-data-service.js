/**
 * Created by anl on 5/4/2018.
 */


(function () {
	'use strict';
	/*global angular, globals*/

	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).factory('productionplanningActivityPpsItemFilterDataService', PpsItemFilterDataService);

	PpsItemFilterDataService.$inject = ['platformDataServiceFactory',
		'ServiceDataProcessArraysExtension',
		'basicsLookupdataLookupDescriptorService',
		'productionplanningCommonStructureFilterService',
		'productionplanningActivityActivityDataService'];

	function PpsItemFilterDataService(platformDataServiceFactory,
									  ServiceDataProcessArraysExtension,
									  basicsLookupdataLookupDescriptorService,
									  PpsCommonStructureFilterService,
									  activityDataService) {

		var filterKey = 'PPSITEM';

		var serviceOption = {
			hierarchicalRootItem: {
				module: angular.module(moduleName),
				serviceName: 'productionplanningActivityPpsItemFilterDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'productionplanning/item/',
					endRead: 'filtered',
					usePostForRead: true,
					initReadData: function (readData) {
						var projectId = readData.ProjectContextId = activityDataService.getSelectedProjectId();
						if (projectId > 0) {
							var token = {
								id: {Id: projectId},
								token: 'project.main'
							};
							readData.PinningContext = [];
							readData.PinningContext.push(token);
						}
					}
				},

				dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems'])],
				useItemFilter: true,
				presenter: {
					tree: {
						parentProp: 'PPSItemFk', childProp: 'ChildItems',
						incorporateDataRead: function (readData, data) {
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.dtos || []
							};

							var allIds = PpsCommonStructureFilterService.getAllFilterIds('productionplanningActivityActivityDataService');
							if (allIds) {
								var markerIds = allIds[filterKey];
								if (markerIds && markerIds.length > 0) {
									setItemMarkers(result.dtos, markerIds);
								}
							}
							basicsLookupdataLookupDescriptorService.attachData(readData);
							return serviceContainer.data.handleReadSucceeded(result, data);
						}
					}
				},
				entityRole: {
					root: {
						moduleName: 'productionplanning.activity',
						itemName: 'PPSItem'
					}
				},
				actions: {} // no create/delete actions
			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption); // jshint ignore:line

		var service = serviceContainer.service;

		service.setShowHeaderAfterSelectionChanged(null);

		service.collectPpsItemIds = function collectPpsItemIds(SelectedPpsItem) {
			return _.map(PpsCommonStructureFilterService.collectItems(SelectedPpsItem, 'ChildItems'), 'Id');
		};

		service.extendByFilter = function extendByFilter(mainServiceName, id, filterService) {

			var PpsItemFk = 'PpsItemFk';
			var filterIds = [];

			// filter leading structure by line items
			if (angular.isFunction(filterService.addLeadingStructureFilterSupport)) {
				filterService.addLeadingStructureFilterSupport(mainServiceName, service, PpsItemFk);
			}

			service.markersChanged = function markersChanged(itemList) {
				if (_.isArray(itemList) && _.size(itemList) > 0) {
					filterIds.length = 0;
					// get all child prj cost group (for each item)
					_.each(itemList, function (item) {
						var Ids = service.collectPpsItemIds(item);
						filterIds = filterIds.concat(Ids);
					});
					if (_.isFunction(filterService.setFilterIds)) {
						filterService.setFilterIds(mainServiceName, filterKey, filterIds);
					}
					filterService.addFilter(id, service, function () {
						return true;
						//return filterIds.indexOf(mntActivity[PpsItemFk]) >= 0;
					}, {
						id: filterKey,
						iconClass: 'tlb-icons ico-filter-pps-item',
						captionId: 'filterPpsItem'
					}, PpsItemFk);
				} else {
					if (_.isFunction(filterService.setFilterIds)) {
						filterService.setFilterIds(mainServiceName, filterKey, []);
					}
					filterService.removeFilter(id);
				}
			};
		};

		function setItemMarkers(ppsItems, markerIds) {
			_.each(ppsItems, function (ppsItem) {
				ppsItem.IsMarked = markerIds.indexOf(ppsItem.Id) >= 0;
				setItemMarkers(ppsItem.ChildItems, markerIds);
			});
		}

		service.load();
		return service;
	}

})();