/**
 * Created by anl on 5/7/2018.
 */


(function () {
	'use strict';
	/*global angular, globals*/

	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).factory('productionplanningActivityControllingUnitFilterDataService', CtrlUnitFilterDataService);

	CtrlUnitFilterDataService.$inject = ['platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'productionplanningCommonStructureFilterService',
		'productionplanningActivityActivityDataService',
		'ServiceDataProcessArraysExtension',
		'controllingStructureImageProcessor'];

	function CtrlUnitFilterDataService(platformDataServiceFactory,
									   basicsLookupdataLookupDescriptorService,
									   ppsCommonStructureFilterService,
									   activityDataService,
									   ServiceDataProcessArraysExtension,
									   controllingStructureImageProcessor) {

		// Must be Upper Case and equal to filterName in CommonLogic
		var filterKey = 'CONTROLLINGUNIT';

		var serviceOption = {
			hierarchicalRootItem: {
				module: angular.module(moduleName),
				serviceName: 'productionplanningActivityControllingUnitFilterDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'controlling/structure/',
					endRead: 'tree',
					initReadData: function (readData) {
						//mainItemId = projectId
						readData.filter = '?mainItemId=' + activityDataService.getSelectedProjectId();
					}
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['ControllingUnits']), controllingStructureImageProcessor],
				useItemFilter: true,
				presenter: {
					tree: {
						parentProp: 'ControllingunitFk',
						childProp: 'ControllingUnits',
						incorporateDataRead: function (readData, data) {
							var allIds = ppsCommonStructureFilterService.getAllFilterIds('productionplanningActivityActivityDataService');
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
						itemName: 'EstCtu'
					}
				},
				actions: {} // no create/delete actions
			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption); // jshint ignore:line

		var service = serviceContainer.service;

		service.setShowHeaderAfterSelectionChanged(null);

		service.collectCtrlUnitIds = function collectCtrlUnitIds(SelectedCtrlUnit) {
			return _.map(ppsCommonStructureFilterService.collectItems(SelectedCtrlUnit, 'ControllingUnits'), 'Id');
		};

		service.extendByFilter = function extendByFilter(mainServiceName, id, filterService) {

			var ControllingUnitFk = 'MdcControllingunitFk';
			var filterIds = [];

			// filter leading structure  for activity
			if (angular.isFunction(filterService.addLeadingStructureFilterSupport)) {
				filterService.addLeadingStructureFilterSupport(mainServiceName, service, ControllingUnitFk);
			}

			service.markersChanged = function markersChanged(itemList) {
				if (_.isArray(itemList) && _.size(itemList) > 0) {
					filterIds.length = 0;
					// get all children of controllingUnit
					_.each(itemList, function (item) {
						var Ids = service.collectCtrlUnitIds(item);
						filterIds = filterIds.concat(Ids);
					});
					if (_.isFunction(filterService.setFilterIds)) {
						filterService.setFilterIds(mainServiceName, filterKey, filterIds);
					}
					filterService.addFilter(id, service, function (mntActivity) {
						return filterIds.indexOf(mntActivity[ControllingUnitFk]) >= 0;
					}, {
						id: filterKey,
						iconClass: 'tlb-icons ico-filter-controlling',
						captionId: 'ctrlUnitFilter'
					}, ControllingUnitFk);
				} else {
					if (_.isFunction(filterService.setFilterIds)) {
						filterService.setFilterIds(mainServiceName, filterKey, []);
					}
					filterService.removeFilter(id);
				}
			};
		};

		function setItemMarkers(controllingUnits, markerIds) {
			_.each(controllingUnits, function (ctrlUnit) {
				ctrlUnit.IsMarked = markerIds.indexOf(ctrlUnit.Id) >= 0;
				setItemMarkers(ctrlUnit.ControllingUnits, markerIds);
			});
		}

		service.load();
		return service;
	}
})();