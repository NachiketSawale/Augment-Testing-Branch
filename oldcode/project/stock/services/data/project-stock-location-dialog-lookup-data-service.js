/**
 * Created by leo on 14.12.2021.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectStockLocationDialogLookupDataService
	 * @function
	 *
	 * @description
	 * projectStockLocationLookupDataService is the data service for project stock location lookup
	 */
	angular.module('project.stock').factory('projectStockLocationDialogLookupDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var lookupDataServiceConfig = {};
			return filterLookupDataService.createInstance(lookupDataServiceConfig);
		}]);
})(angular);
