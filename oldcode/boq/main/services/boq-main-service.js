/**
 * Created by bh on 16.12.2014.
 */
(function () {
	/* global */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainService
	 * @function
	 *
	 * @description
	 * boqMainMainService is the data service for all main related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainService', ['boqMainServiceFactory', 'basicsLookupdataLookupFilterService',
		function (boqMainServiceFactory, basicsLookupdataLookupFilterService) {

			// The instance of the main service - to be filled with functionality below
			var option = {
				moduleContext: {
					moduleName: moduleName
				}
			};
			var filters = [
				{
					key: 'boq-main-material-type-default-estimate-filter',
					serverSide: true,
					fn: function (entity, searchOptions) {
						searchOptions.MaterialTypeFilter = {
							IsForEstimate: true
						};
					}
				}
			];

			var service = boqMainServiceFactory.createNewBoqMainService(option).service;

			// Set container UUID of the container related to this service instance
			service.setContainerUUID('342bf3af97964f5ba24d3e3acc2242dd'); // Todo BH: It would be great to somehow be able to have direct access to the definition of the container UUID instead of using it here directly.

			service.registerFilters = registerFilters;
			service.unregisterFilters = unregisterFilters;

			return service;

			function registerFilters() {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			}

			function unregisterFilters() {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			}

		}]);
})();
