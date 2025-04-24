(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticCardDialogLookupDataService
	 * @function
	 *
	 * @description
	 * logisticJobLookupDataService is the data service for requisition look ups
	 */
	angular.module('logistic.card').factory('logisticCardDialogLookupDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var lookupDataServiceConfig = {};

			return filterLookupDataService.createInstance(lookupDataServiceConfig);
		}]);
})(angular);
