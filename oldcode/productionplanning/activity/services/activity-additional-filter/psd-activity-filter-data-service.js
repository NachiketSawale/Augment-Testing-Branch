/**
 * Created by anl on 6/11/2018.
 */


(function () {
	'use strict';
	/*global angular, globals*/

	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).factory('productionplanningActivityPsdActivityFilterDataService', PsdActivityFilterDataService);

	PsdActivityFilterDataService.$inject = ['platformDataServiceFactory',
		'ServiceDataProcessArraysExtension',
		'basicsLookupdataLookupDescriptorService',
		'productionplanningCommonStructureFilterService',
		'productionplanningActivityActivityDataService',
		'cloudDesktopPinningContextService',
		'platformDataServiceProcessDatesBySchemeExtension',
		'schedulingMainActivityImageProcessor'];

	function PsdActivityFilterDataService(platformDataServiceFactory,
										  ServiceDataProcessArraysExtension,
										  basicsLookupdataLookupDescriptorService,
										  PpsCommonStructureFilterService,
										  activityDataService,
										  cloudDesktopPinningContextService,
										  platformDataServiceProcessDatesBySchemeExtension,
										  schedulingMainActivityImageProcessor) {

		var filterKey = 'PSDACTIVITY';

		var serviceOption = {
			hierarchicalRootItem: {
				module: angular.module(moduleName),
				serviceName: 'productionplanningActivityPsdActivityFilterDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'scheduling/main/activity/',
					endRead: 'filtered',
					usePostForRead: true,
					initReadData: function (readData) {
						var projectId = readData.ProjectContextId = activityDataService.getSelectedProjectId();
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
						itemName: 'Activities',
						moduleName: 'cloud.desktop.moduleDisplayNameSchedulingMain'
					}
				},
				actions: {} // no create/delete actions
			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption); // jshint ignore:line

		var service = serviceContainer.service;

		service.setShowHeaderAfterSelectionChanged(null);

		service.collectPpsItemIds = function collectPpsItemIds(SelectedPpsItem) {
			return _.map(PpsCommonStructureFilterService.collectItems(SelectedPpsItem, 'Activities'), 'Id');
		};

		service.extendByFilter = function extendByFilter(mainServiceName, id, filterService) {

			var PsdActivityFk = 'PsdActivityFk';
			var filterIds = [];

			// filter leading structure by line items
			if (angular.isFunction(filterService.addLeadingStructureFilterSupport)) {
				filterService.addLeadingStructureFilterSupport(mainServiceName, service, PsdActivityFk);
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