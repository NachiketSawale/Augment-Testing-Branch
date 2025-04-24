/**
 * Created by leo on 13.09.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordDialogLookupDataService
	 * @function
	 *
	 * @description
	 * logisticDispatchingHeaderLookupDataServiceNew is the data service for header look ups
	 */
	angular.module('logistic.dispatching').factory('logisticDispatchingRecordDialogLookupDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var lookupDataServiceConfig = {};
			return filterLookupDataService.createInstance(lookupDataServiceConfig);
		}]);
})(angular);
