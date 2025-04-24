/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceSidebarSearchExtension
	 * @function
	 * @requires cloudDesktopSidebarService, platformDataServiceSelectionExtension
	 * @description
	 * platformDataServiceSidebarSearchExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceSidebarSearchExtension', PlatformDataServiceSidebarSearchExtension);

	PlatformDataServiceSidebarSearchExtension.$inject = ['cloudDesktopSidebarService', 'platformDataServiceSelectionExtension'];

	function PlatformDataServiceSidebarSearchExtension(cloudDesktopSidebarService, platformDataServiceSelectionExtension) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceSidebarSearchExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this;

		this.addSidebarSearch = function addSidebarSearch(container, options) {
			if (options.sidebarSearch) {
				container.data.sidebarSearchOptions = options.sidebarSearch;
				container.data.sidebarSearch = true;
				container.data.searchFilter = null;

				container.data.clearSidebarFilter = function doClearSidebarFilter(result, data) {
					self.clearSidebarFilter(result, data);
				};

				container.service.executeSearchFilter = function doExecuteSearchFilter(e, filter) {
					self.executeSearchFilter(filter, container.data);
				};

				container.service.registerSidebarFilter = function doRegisterSidebarFilter() {
					registerSidebarFilter(container);
				};
			}
		};

		this.clearSidebarFilter = function clearSidebarFilter(result, data) {
			var filterParams = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(data.searchFilter);

			cloudDesktopSidebarService.updateFilterResult({
				isPending: false,
				filterRequest: filterParams,
				filterResult: result.FilterResult
			});
			data.searchFilter = null;
		};

		this.executeSearchFilter = function executeSearchFilter(filter, data) {
			// It is not necessarily the main entity service, that has to read the data. But in first call,
			// data is the container.data object of the main entity service. In this case we have to redirect
			// to the service responsible to read the specified entity.

			var service;
			if (data.getDataServiceForSearchedTable && filter && filter.furtherFilters) {
				service = data.getDataServiceForSearchedTable(filter);
			}
			if (service) {
				service.dispatchSearchFilterExecution(filter, self);
			} else {
				self.readDataInExecuteSearchFilter(filter, data);
			}
		};

		// this.registerSidebarFilter = function registerSidebarFilter(data) {
		function registerSidebarFilter(container) {
			var searchOptions = container.data.sidebarSearchOptions.options;

			// default value for now
			searchOptions.httpRoute = searchOptions.httpRoute || container.data.httpReadRoute;
			// primitive hack for now
			if (container.data.getList().length > 0) {
				searchOptions.disableEntityRestore = true;
			}

			cloudDesktopSidebarService.initializeFilterRequest(searchOptions);

			if (searchOptions.pinningOptions) {
				searchOptions.pinningOptions.isActive = angular.isDefined(searchOptions.pinningOptions.isActive) ? searchOptions.pinningOptions.isActive : true; // default we switch it on if option not set
				container.service.getPinningOptions = function () {
					return searchOptions.pinningOptions;
				};
			}
		}

		this.readDataInExecuteSearchFilter = function readDataInExecuteSearchFilter(filter, data) {
			data.searchFilter = filter;
			platformDataServiceSelectionExtension.deselect(data);

			var http = {reset: false};

			if (data.sidebarSearchOptions.http) {
				http.reset = true;
				http.endPointRead = data.endRead;
				http.postForRead = data.usePostForRead;

				data.endRead = data.sidebarSearchOptions.http.endPointRead;
				data.usePostForRead = true;
			}

			data.filter = '';

			data.doReadData(data).then(function () {
				if (data.sidebarSearchOptions.selectAfterSearchSucceeded) {
					var toSel = data.getItemById(filter.furtherFilters.Value, data);
					platformDataServiceSelectionExtension.doSelect(toSel, data);
				}
			});

			if (http.reset) {
				data.endRead = http.endPointRead;
				data.usePostForRead = http.postForRead;
			}
		};

		this.reloadEntitiesViaSearchFilter = function reloadEntitiesViaSearchFilter(filter, data, reloadService) {
			let origSearchFilter = _.cloneDeep(data.searchFilter);
			data.searchFilter = filter;

			var http = {reset: false};

			if (data.sidebarSearchOptions.http) {
				http.reset = true;
				http.endPointRead = data.endRead;
				http.postForRead = data.usePostForRead;

				data.endRead = data.sidebarSearchOptions.http.endPointRead;
				data.usePostForRead = true;
			}

			data.filter = '';

			var res = data.doCallHTTPRead(filter, data, reloadService.onReloadSucceeded).then(function (result) {
				data.searchFilter = origSearchFilter;

				return result;
			});

			if (http.reset) {
				data.endRead = http.endPointRead;
				data.usePostForRead = http.postForRead;
			}

			return res;
		};
	}
})();
