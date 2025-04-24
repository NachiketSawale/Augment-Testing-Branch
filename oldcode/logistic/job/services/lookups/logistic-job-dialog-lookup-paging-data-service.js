/**
 * Created by leo on 13.09.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticJobLookupDataService
	 * @function
	 *
	 * @description
	 * logisticJobLookupDataService is the data service for requisition look ups
	 */
	angular.module('logistic.job').factory('logisticJobDialogLookupPagingDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var activityLookupDataServiceConfig = {};

			return filterLookupDataService.createInstance(activityLookupDataServiceConfig);
		}]);
})(angular);
