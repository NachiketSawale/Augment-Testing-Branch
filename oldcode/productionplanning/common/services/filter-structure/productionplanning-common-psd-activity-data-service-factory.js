/**
 * Created by las on 7/31/2018.
 */


(function () {
	'use strict';
	/*global angular, globals*/

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('productionplanningCommonPsdActivityFilterDataServiceFactory', CommonPsdActivityFilterDataServiceFactory);

	CommonPsdActivityFilterDataServiceFactory.$inject = ['$injector', 'platformDataServiceFactory',
		'ServiceDataProcessArraysExtension',
		'basicsLookupdataLookupDescriptorService',
		'productionplanningCommonStructureFilterService',

		'cloudDesktopPinningContextService',
		'platformDataServiceProcessDatesBySchemeExtension',
		'schedulingMainActivityImageProcessor'];

	function CommonPsdActivityFilterDataServiceFactory($injector, platformDataServiceFactory,
		ServiceDataProcessArraysExtension,
		basicsLookupdataLookupDescriptorService,
		PpsCommonStructureFilterService,

		cloudDesktopPinningContextService,
		platformDataServiceProcessDatesBySchemeExtension,
		schedulingMainActivityImageProcessor) {

		var filterKey = 'PSDACTIVITY';

		var service4ActivityFilter = [];
		function  createActivityFilterService(mainService) {
			var mainServiceName = mainService.getServiceName();
			var service = service4ActivityFilter[mainServiceName];
			if(service === undefined || service === null){
				var serviceOption = {
					hierarchicalRootItem: {
						module: angular.module(moduleName),
						serviceName: 'productionplanningCommonPsdActivityFilterDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'scheduling/main/activity/',
							endRead: 'filtered',
							usePostForRead: true,
							initReadData: function (readData) {
								var projectId = readData.ProjectContextId = mainService.getSelectedProjectId();
								if (projectId > 0) {
									readData.PinningContext = [];
									readData.PinningContext.push(new cloudDesktopPinningContextService.PinningItem('project.main', projectId,
										cloudDesktopPinningContextService.concate2StringsWithDelimiter('', '', ' - '))
									);
								}
							}
						},

						dataProcessor: [new ServiceDataProcessArraysExtension(['Activities']), schedulingMainActivityImageProcessor,
							platformDataServiceProcessDatesBySchemeExtension.createProcessor({
								typeName: 'ActivityDto',
								moduleSubModule: 'Scheduling.Main'
							})],
						useItemFilter: true,
						presenter: {
							tree: {
								parentProp: 'ParentActivityFk',
								childProp: 'Activities',
								childSort: true,
								sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
								incorporateDataRead: function (readData, data) {
									var result = {
										FilterResult: readData.FilterResult,
										dtos: readData.dtos || []
									};

									var allIds = PpsCommonStructureFilterService.getAllFilterIds(mainServiceName);
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
								itemName: 'Activities',
								moduleName: 'cloud.desktop.moduleDisplayNameSchedulingMain'
							}
						},
						actions: {} // no create/delete actions
					}
				};
				/* jshint -W003 */
				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

				service = serviceContainer.service;
				service4ActivityFilter[mainServiceName] = service;

				service.setShowHeaderAfterSelectionChanged(null);
				var projectId = mainService.getSelectedProjectId();
				service.setFilter('projectId=' + projectId);

				if (projectId) {
					service.load();
				}
			}

			return service;
		}


		function collectPsdActivityIds(SelectedPpsItem) {
			return _.map(PpsCommonStructureFilterService.collectItems(SelectedPpsItem, 'Activities'), 'Id');
		}

		function extendByFilter(mainServiceName, avtivityFilterService, id, filterService) {

			var PsdActivityFk = 'PsdActivityFk';
			var filterIds = [];

			// filter leading structure by line items
			if (angular.isFunction(filterService.addLeadingStructureFilterSupport)) {
				filterService.addLeadingStructureFilterSupport(mainServiceName, avtivityFilterService, PsdActivityFk);
			}

			avtivityFilterService.markersChanged = function markersChanged(itemList) {
				if (_.isArray(itemList) && _.size(itemList) > 0) {
					filterIds.length = 0;
					// get all child prj cost group (for each item)
					_.each(itemList, function (item) {
						var Ids = collectPsdActivityIds(item);
						filterIds = filterIds.concat(Ids);
					});
					if (_.isFunction(filterService.setFilterIds)) {
						filterService.setFilterIds(mainServiceName, filterKey, filterIds);
					}
					filterService.addFilter(id, avtivityFilterService, function () {
						return true;
					}, {
						id: filterKey,
						iconClass: 'tlb-icons ico-filter-activity',
						captionId: 'filterPsdActivity'
					}, PsdActivityFk);
				} else {
					if (_.isFunction(filterService.setFilterIds)) {
						filterService.setFilterIds(mainServiceName, filterKey, []);
					}
					filterService.removeFilter(id);
				}
			};
		}

		function setItemMarkers(ppsItems, markerIds) {
			_.each(ppsItems, function (ppsItem) {
				ppsItem.IsMarked = markerIds.indexOf(ppsItem.Id) >= 0;
				setItemMarkers(ppsItem.ChildItems, markerIds);
			});
		}

		function getPsdActivityList(mainServiceName) {
			var list = [];
			var ctrlnitFilterService = service4ActivityFilter[mainServiceName];
			if(ctrlnitFilterService){
				list = ctrlnitFilterService.getList();
			}
			return list;
		}

		return{
			createActivityFilterService:createActivityFilterService,
			collectPsdActivityIds: collectPsdActivityIds,
			extendByFilter: extendByFilter,
			getPsdActivityList: getPsdActivityList
		};
	}

})();