/**
 * Created by anl on 7/12/2018.
 */

(function () {
	'use strict';
	/* global angular, globals, _ */
	const moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsCommonSiteFilterDataFactory', SiteFilterDataFactory);

	SiteFilterDataFactory.$inject = ['platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'productionplanningCommonStructureFilterService',
		'ServiceDataProcessArraysExtension',
		'basicsSiteImageProcessor', '$http', '$q'];

	function SiteFilterDataFactory(platformDataServiceFactory,
								   basicsLookupdataLookupDescriptorService,
								   PpsCommonStructureFilterService,
								   ServiceDataProcessArraysExtension,
								   basicsSiteImageProcessor, $http, $q) {
		var service = {};

		service.createSiteFilterStructureService = function (_moduleName, _serviceName, initReadData, selectionFilter) {

			var filterKey = 'SITE';

			var serviceOption = {
				hierarchicalRootItem: {
					module: angular.module(_moduleName),
					serviceName: _serviceName,
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/sitenew/',
						endRead: 'filtered',
						usePostForRead: true,
						extendSearchFilter: function (filterRequest) {
							filterRequest.furtherFilters = [{
								Token: 'site.isdisp',
								Value: true
							}];
						},
						initReadData: initReadData
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems']), basicsSiteImageProcessor],
					useItemFilter: true,
					presenter: {
						tree: {
							parentProp: 'SiteFk', childProp: 'ChildItems',
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData);
								var allIds = PpsCommonStructureFilterService.getAllFilterIds();
								if (allIds) {
									var markerIds = allIds[filterKey];
									if (markerIds && markerIds.length > 0) {
										service.setItemMarkers(readData.dtos, markerIds);
									}
								}

								if(service.markedItems.length > 0){
									service.setItemMarkers(readData.dtos, _.map(service.markedItems, 'Id'));
								}

								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData.dtos || []
								};

								return serviceContainer.data.handleReadSucceeded(result, data);
							}
						}
					},
					entityRole: {
						root: {
							moduleName: _moduleName,
							itemName: 'Site'
						}
					},
					actions: {} // no create/delete actions
				}
			};

			/*jshint -W003*/
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			serviceContainer.data.isRealRootForOpenedModule = () => {return false;};

			var service = serviceContainer.service;

			service.markedItems = [];

			service.setShowHeaderAfterSelectionChanged(null);

			service.collectSiteIds = function collectSiteIds(SelectedSite) {
				let sites = PpsCommonStructureFilterService.collectItems(SelectedSite, 'ChildItems');
				if(selectionFilter && typeof selectionFilter === 'function') {
					sites = sites.filter(selectionFilter);
				}
				return _.map(sites, 'Id');
			};

			service.extendByFilter = function extendByFilter(mainServiceName, id, filterService) {

				var SiteFk = 'SiteFk';
				var filterIds = [];

				// filter leading structure for activity
				if (angular.isFunction(filterService.addLeadingStructureFilterSupport)) {
					filterService.addLeadingStructureFilterSupport(mainServiceName, service, SiteFk);
				}

				service.markersChanged = function markersChanged(itemList, loadData) {
					if (_.isEqual(_.map(service.markedItems, 'Id'), _.map(itemList, 'Id'))){
						return;
					}
					loadData = _.isUndefined(loadData) ? true : loadData;

					if (_.isArray(itemList) && _.size(itemList) > 0) {
						service.markedItems = itemList;
						filterIds.length = 0;
						// get get all children of site
						_.each(itemList, function (item) {
							var Ids = service.collectSiteIds(item);
							filterIds = filterIds.concat(Ids);
						});
						if (_.isFunction(filterService.setFilterIds)) {
							filterService.setFilterIds(mainServiceName, filterKey, filterIds, loadData);
						}
						filterService.addFilter(id, service, function () {
							return true;
						}, {
							id: filterKey,
							iconClass: 'tlb-icons ico-filter-site',
							captionId: 'filterSite'
						}, SiteFk);
					} else {
						service.markedItems = [];
						if (_.isFunction(filterService.setFilterIds)) {
							filterService.setFilterIds(mainServiceName, filterKey, [], loadData);
						}
						filterService.removeFilter(id);
					}
				};
			};

			service.selectedItem = null;

			service.selectionChanged = function (e, item) {
				if (!_.isEmpty(item)) {
					service.selectedItem = item;
				} else {
					service.selectedItem = null;
				}
			};

			service.getSelectedItem = function () {
				return service.selectedItem;
			};

			service.getDefaultSiteId = function () {
				return $http.get(globals.webApiBaseUrl + 'transportplanning/transport/route/gettrsconfigdefaultsitefk');
			};

			service.setItemMarkers = function(sites, markerIds, markedSites) {
				_.each(sites, function (site) {
					site.IsMarked = markerIds.indexOf(site.Id) >= 0;
					if (site.IsMarked && markedSites && _.isArray(markedSites)) {
						markedSites.push(site);
					}
					service.setItemMarkers(site.ChildItems, markerIds, markedSites);
				});
			};

			service.getMarkedItems = function (sites, markedSites) {
				if (markedSites && _.isArray(markedSites)) {
					_.each(sites, function (site) {
						if (site.IsMarked) {
							markedSites.push(site);
						}
						service.getMarkedItems(site.ChildItems, markedSites);
					});
				}
			};

			service.clearMarkers = function () {
				service.markedItems = [];
			};

			basicsLookupdataLookupDescriptorService.loadData(['SiteType']);

			return service;
		};
		//factory service
		return service;
	}
})();
