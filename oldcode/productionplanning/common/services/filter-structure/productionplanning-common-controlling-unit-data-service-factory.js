/**
 * Created by las on 7/31/2018.
 */


(function () {
	'use strict';
	/*global angular, globals*/

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('productionplanningCommonControllingUnitFilterDataServiceFactory', CommonCtrlUnitFilterDataServiceFactory);

	CommonCtrlUnitFilterDataServiceFactory.$inject = ['platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'productionplanningCommonStructureFilterService',
		'cloudDesktopSidebarService',
		'ServiceDataProcessArraysExtension',
		'controllingStructureImageProcessor'];

	function CommonCtrlUnitFilterDataServiceFactory(platformDataServiceFactory,
		basicsLookupdataLookupDescriptorService,
		ppsCommonStructureFilterService,
		cloudDesktopSidebarService,
		ServiceDataProcessArraysExtension,
		controllingStructureImageProcessor) {

		// Must be Upper Case and equal to filterName in CommonLogic
		var filterKey = 'CONTROLLINGUNIT';

		var service4CtrlUnitFilter = [];

		function createCtrlUnitFilterService(mainService) {
			var mainServiceName = mainService.getServiceName();
			var service = service4CtrlUnitFilter[mainServiceName];
			if(service === null || service === undefined){
				initMainService(mainService);
				var serviceOption = {
					hierarchicalRootItem: {
						module: angular.module(moduleName),
						serviceName: 'productionplanningCommonControllingUnitFilterDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'controlling/structure/',
							endRead: 'tree',
							initReadData: function (readData) {
								readData.filter = '?mainItemId=' + mainService.getSelectedProjectId();
							}
						},
						dataProcessor: [new ServiceDataProcessArraysExtension(['ControllingUnits']), controllingStructureImageProcessor],
						useItemFilter: true,
						presenter: {
							tree: {
								parentProp: 'ControllingunitFk',
								childProp: 'ControllingUnits',
								incorporateDataRead: function (readData, data) {
									var allIds = ppsCommonStructureFilterService.getAllFilterIds(mainServiceName);
									if (allIds) {
										var markerIds = allIds[filterKey];
										if (markerIds && markerIds.length > 0) {
											setItemMarkers(readData, markerIds);
										}
									}
									basicsLookupdataLookupDescriptorService.attachData(readData);
									return data.handleReadSucceeded(readData, data);
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
				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

				service = serviceContainer.service;
				service4CtrlUnitFilter[mainServiceName] = service;
				service.setShowHeaderAfterSelectionChanged(null);
				var projectId = mainService.getSelectedProjectId();
				service.setFilter('projectId=' + projectId);

				if (projectId) {
					service.load();
				}
			}

			return service;
		}

		function initMainService(mainService) {
			if(mainService.getSelectedProjectId === undefined){
				mainService.getSelectedProjectId = function () {
					return cloudDesktopSidebarService.filterRequest.projectContextId || -1;
				};
			}
			if(mainService.getCtrlUnitList === undefined){
				mainService.getCtrlUnitList = function () {
					var serviceName = mainService.getServiceName();
					return getCtrlUnitList(serviceName);
				};
			}
		}

		function collectCtrlUnitIds(SelectedCtrlUnit) {
			return _.map(ppsCommonStructureFilterService.collectItems(SelectedCtrlUnit, 'ControllingUnits'), 'Id');
		}

		function extendByFilter(mainServiceName, ctrlUnitFilterService, id, filterService) {

			var ControllingUnitFk = 'MdcControllingunitFk';
			var filterIds = [];

			// filter leading structure  for activity
			if (angular.isFunction(filterService.addLeadingStructureFilterSupport)) {
				filterService.addLeadingStructureFilterSupport(mainServiceName, ctrlUnitFilterService, ControllingUnitFk);
			}

			ctrlUnitFilterService.markersChanged = function markersChanged(itemList) {
				if (_.isArray(itemList) && _.size(itemList) > 0) {
					filterIds.length = 0;
					// get all children of controllingUnit
					_.each(itemList, function (item) {
						var Ids = collectCtrlUnitIds(item);
						filterIds = filterIds.concat(Ids);
					});
					if (_.isFunction(filterService.setFilterIds)) {
						filterService.setFilterIds(mainServiceName, filterKey, filterIds);
					}
					filterService.addFilter(id, ctrlUnitFilterService, function (eventEntity) {
						return filterIds.indexOf(eventEntity[ControllingUnitFk]) >= 0;
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
		}

		function setItemMarkers(controllingUnits, markerIds) {
			_.each(controllingUnits, function (ctrlUnit) {
				ctrlUnit.IsMarked = markerIds.indexOf(ctrlUnit.Id) >= 0;
				setItemMarkers(ctrlUnit.ControllingUnits, markerIds);
			});
		}

		function  getCtrlUnitList(mainServiceName) {
			var list = [];
			var ctrlnitFilterService = service4CtrlUnitFilter[mainServiceName];
			if(ctrlnitFilterService){
				list = ctrlnitFilterService.getList();
			}
			return list;
		}

		return{
			createCtrlUnitFilterService:createCtrlUnitFilterService,
			collectCtrlUnitIds: collectCtrlUnitIds,
			extendByFilter: extendByFilter,
			getCtrlUnitList : getCtrlUnitList
		};
	}
})();