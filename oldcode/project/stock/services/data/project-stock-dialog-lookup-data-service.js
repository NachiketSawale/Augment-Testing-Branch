/**
 * Created by shen on 6/13/2022
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectStockDialogLookupDataService
	 * @function
	 *
	 * @description
	 * projectStockLocationLookupDataService is the data service for project stock lookup
	 */
	angular.module('project.stock').factory('projectStockDialogLookupDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			let lookupDataServiceConfig = {};
			return filterLookupDataService.createInstance(lookupDataServiceConfig);
		}]);
})(angular);
