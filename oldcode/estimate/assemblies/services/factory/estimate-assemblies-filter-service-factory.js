/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */

	/**
	 * @ngdoc service
	 * @name estimateAssembliesFilterServiceFactory
	 * @function
	 *
	 * @description
	 * estimateAssembliesFilterServiceFactory for filtering assemblies container by combination of several filters.
	 */
	angular.module('estimate.assemblies').factory('estimateAssembliesFilterServiceFactory', ['estimateCommonFilterServiceProvider',
		function (estimateCommonFilterServiceProvider) {

			let factoryService = {};

			factoryService.createEstAssembliesFilterService = function (moduleName, subModuleName){

				let service = estimateCommonFilterServiceProvider.getInstance(moduleName, subModuleName);

				let structure2FilterIds = {},
					filterRequest = {};

				service.setFilterIds = function (key, ids) {
					structure2FilterIds[key] = ids;
					let dataService = service.getServiceToBeFiltered();
					if (dataService && _.isFunction(dataService.load)) {
						dataService.load();
					}
				};

				service.getAllFilterIds = function() {
					return structure2FilterIds;
				};

				service.getFilterRequest = function() {
					return filterRequest;
				};

				service.setFilterRequest = function(_filterRequest) {
					filterRequest = _filterRequest;
				};

				return service;
			};

			return factoryService;

		}]);
})();
