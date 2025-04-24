/**
 * Created by anl on 5/4/2018.
 */


(function () {
	'use strict';
	/*global angular, globals*/

	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).factory('productionplanningActivityPrjLocationFilterDataService', PrjLocationFilterDataService);

	PrjLocationFilterDataService.$inject = ['platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'productionplanningCommonStructureFilterService',
		'productionplanningActivityActivityDataService',
		'ServiceDataProcessArraysExtension',
		'projectLocationMainImageProcessor'];

	function PrjLocationFilterDataService(platformDataServiceFactory,
										  basicsLookupdataLookupDescriptorService,
										  PpsCommonStructureFilterService,
										  activityDataService,
										  ServiceDataProcessArraysExtension,
										  projectLocationMainImageProcessor) {

		// Must be Upper Case and equal to filterName in CommonLogic
		var filterKey = 'PEOJECTLOCATION';

		var serviceOption = {
			hierarchicalRootItem: {
				module: angular.module(moduleName),
				serviceName: 'productionplanningActivityPrjLocationFilterDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'project/location/',
					initReadData: function (readData) {
						readData.filter = '?projectId=' + activityDataService.getSelectedProjectId();
					}
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['Locations']), projectLocationMainImageProcessor],
				useItemFilter: true,
				presenter: {
					tree: {
						parentProp: 'LocationParentFk', childProp: 'Locations',
						incorporateDataRead: function (readData, data) {
							var allIds = PpsCommonStructureFilterService.getAllFilterIds('productionplanningActivityActivityDataService');
							if (allIds) {
								var markerIds = allIds[filterKey];
								if (markerIds && markerIds.length > 0) {
									setItemMarkers(readData, markerIds);
								}
							}
							basicsLookupdataLookupDescriptorService.attachData(readData);
							return serviceContainer.data.handleReadSucceeded(readData, data);
						}
					}
				},
				entityRole: {
					root: {
						moduleName: 'productionplanning.activity',
						itemName: 'Locations'
					}
				},
				actions: {} // no create/delete actions
			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption); // jshint ignore:line

		var service = serviceContainer.service;

		service.setShowHeaderAfterSelectionChanged(null);

		service.collectPrjLocationIds = function collectPrjLocationIds(SelectedPrjLocation) {
			return _.map(PpsCommonStructureFilterService.collectItems(SelectedPrjLocation, 'Locations'), 'Id');
		};

		service.extendByFilter = function extendByFilter(mainServiceName, id, filterService) {

			var PrjLocationFk = 'PrjLocationFk';
			var filterIds = [];

			// filter leading structure for activity
			if (angular.isFunction(filterService.addLeadingStructureFilterSupport)) {
				filterService.addLeadingStructureFilterSupport(mainServiceName, service, PrjLocationFk);
			}

			service.markersChanged = function markersChanged(itemList) {
				if (_.isArray(itemList) && _.size(itemList) > 0) {
					filterIds.length = 0;
					// get get all children of prjLocation
					_.each(itemList, function (item) {
						var Ids = service.collectPrjLocationIds(item);
						filterIds = filterIds.concat(Ids);
					});
					if (_.isFunction(filterService.setFilterIds)) {
						filterService.setFilterIds(mainServiceName, filterKey, filterIds);
					}
					filterService.addFilter(id, service, function (mntActivity) {
						return filterIds.indexOf(mntActivity[PrjLocationFk]) >= 0;
					}, {
						id: filterKey,
						iconClass: 'tlb-icons ico-filter-location',
						captionId: 'prjLocationFilter'
					}, PrjLocationFk);
				} else {
					if (_.isFunction(filterService.setFilterIds)) {
						filterService.setFilterIds(mainServiceName, filterKey, []);
					}
					filterService.removeFilter(id);
				}
			};
		};

		function setItemMarkers(prjLocations, markerIds) {
			_.each(prjLocations, function (location) {
				location.IsMarked = markerIds.indexOf(location.Id) >= 0;
				setItemMarkers(location.ChildItems, markerIds);
			});
		}

		service.load();
		return service;
	}

})();